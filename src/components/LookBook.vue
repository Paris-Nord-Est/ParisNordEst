<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";

// Components
import LoaderItem from "./LoaderItem.vue";

const photos = ref([]);
const loading = ref(true);
const error = ref(null);
const imageLoadErrors = ref(new Set());
let imageObserver = null;
let resizeObserver = null;
const masonryContainer = ref(null);

const sizes = [400, 800, 1200];

// Insert Cloudinary transformations after /upload/
const insertCloudinaryTransform = (url, transform) => {
  return url.replace(/\/upload\//, `/upload/${transform}/`);
};

const getDataSrcSet = (url) => {
  const responsiveImages = sizes.map((size) => {
    const transformed = insertCloudinaryTransform(
      url,
      `c_scale,w_${size},q_auto,f_auto`
    );
    return `${transformed} ${size}w`;
  });

  return responsiveImages.join(", ");
};

// Get optimized image URL for the src attribute
const getOptimizedUrl = (url) => {
  return insertCloudinaryTransform(url, "c_scale,w_800,q_auto,f_auto");
};

// Get tiny blurred placeholder (LQIP - Low Quality Image Placeholder)
const getBlurPlaceholder = (url) => {
  return insertCloudinaryTransform(url, "w_50,e_blur:1000,q_auto:low,f_auto");
};

// Fetch images from API (both Cloudinary and Contentful)
const fetchDataFromCloudinary = async () => {
  try {
    const startTime = performance.now();
    const data = await fetch("https://contentful-security.herokuapp.com");
    const res = await data.json();
    const endTime = performance.now();
    console.log(`Fetch and parse took ${Math.round(endTime - startTime)} ms`);

    // Get Cloudinary images with dimensions
    const cloudinaryPhotos =
      res.cloudinaryImages?.resources?.map(({ secure_url, width, height }) => ({
        url: secure_url,
        width,
        height,
        type: "cloudinary",
      })) || [];

    console.log(res.cloudinaryImages);

    if (cloudinaryPhotos.length === 0) {
      throw new Error("No images found");
    }

    console.log(`Loaded ${cloudinaryPhotos.length} images`);
    // Randomize images
    photos.value = cloudinaryPhotos.sort(() => 0.5 - Math.random());
    loading.value = false;
  } catch (e) {
    console.error("Failed to load lookbook images:", e);
    error.value = e;
    loading.value = false;
  }
};

// Handle individual image load errors
const handleImageError = (photoUrl) => {
  imageLoadErrors.value.add(photoUrl);
};

// Retry loading images
const retryLoad = () => {
  error.value = null;
  loading.value = true;
  imageLoadErrors.value.clear();
  fetchDataFromCloudinary();
};

// Filter out images with errors
const validPhotos = computed(() => {
  return photos.value.filter((photo) => !imageLoadErrors.value.has(photo.url));
});

// JavaScript Masonry Layout
const layoutMasonry = () => {
  if (!masonryContainer.value) return;

  const container = masonryContainer.value;
  const items = Array.from(container.children);

  if (items.length === 0) return;

  // Get column count based on screen width
  const getColumnCount = () => {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1200) return 2;
    if (width < 1600) return 3;
    return 4;
  };

  const columnCount = getColumnCount();
  const gap = window.innerWidth < 768 ? 8 : 16;
  const padding =
    window.innerWidth < 768 ? 8 : window.innerWidth < 1200 ? 32 : 48;

  const containerWidth = container.offsetWidth - padding * 2;
  const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

  // Initialize column heights
  const columnHeights = new Array(columnCount).fill(0);

  items.forEach((item, index) => {
    // Find shortest column
    const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));

    // Calculate position
    const x = shortestColumn * (columnWidth + gap);
    const y = columnHeights[shortestColumn];

    // Position item
    item.style.position = "absolute";
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.width = `${columnWidth}px`;

    // Get aspect ratio from data attributes or naturalHeight/Width
    const img = item.querySelector("img");
    let itemHeight;

    // Try to get dimensions from data attributes first
    const dataWidth = img?.dataset.width;
    const dataHeight = img?.dataset.height;

    if (dataWidth && dataHeight) {
      itemHeight =
        (parseFloat(dataHeight) / parseFloat(dataWidth)) * columnWidth;
      item.style.height = `${itemHeight}px`;
    } else if (img && img.naturalHeight && img.naturalWidth) {
      itemHeight = (img.naturalHeight / img.naturalWidth) * columnWidth;
      item.style.height = `${itemHeight}px`;
    } else {
      // Default aspect ratio for images not yet loaded
      itemHeight = columnWidth * 1.5;
    }

    columnHeights[shortestColumn] += itemHeight + gap;
  });

  // Set container height
  const maxHeight = Math.max(...columnHeights);
  container.style.height = `${maxHeight}px`;
};

// Setup lazy loading observer
const setupLazyLoading = async () => {
  // Wait for Vue to render the images
  await nextTick();

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          // Only load if not already loaded
          if (src && img.dataset.src) {
            console.log("Loading image:", src.substring(0, 50) + "...");
            img.src = src;
            img.removeAttribute("data-src");

            // Relayout when image loads
            img.onload = () => {
              img.classList.add("loaded");
              layoutMasonry();
            };
          }
          if (srcset && img.dataset.srcset) {
            img.srcset = srcset;
            img.removeAttribute("data-srcset");
          }

          // Stop observing this image
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "200px", // Start loading 200px before entering viewport
      threshold: 0.01,
    }
  );

  // Observe all images
  const images = document.querySelectorAll(".lookbook-image[data-src]");
  console.log(`Observing ${images.length} images for lazy loading`);
  images.forEach((img) => {
    imageObserver.observe(img);
  });

  // Initial layout
  layoutMasonry();
};

onMounted(async () => {
  await fetchDataFromCloudinary();
  await setupLazyLoading();

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      layoutMasonry();
    }, 150);
  });
});

onBeforeUnmount(() => {
  if (imageObserver) {
    imageObserver.disconnect();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <div class="lookbook-container">
    <!-- Loading State -->
    <div v-if="loading" class="lookbook-loading">
      <LoaderItem />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="lookbook-error">
      <p>Failed to load lookbook images</p>
      <button class="retry-button" @click="retryLoad">Retry</button>
    </div>

    <!-- Photos Masonry Grid -->
    <div
      v-else-if="validPhotos.length > 0"
      ref="masonryContainer"
      class="lookbook-masonry"
    >
      <div v-for="photo in validPhotos" :key="photo.url" class="lookbook-item">
        <img
          class="lookbook-image"
          :src="getBlurPlaceholder(photo.url)"
          :data-src="getOptimizedUrl(photo.url)"
          :data-srcset="getDataSrcSet(photo.url)"
          :data-width="photo.width"
          :data-height="photo.height"
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 400px"
          alt="Paris Nord-Est lookbook"
          @load="(e) => e.target.classList.add('loaded')"
          @error="handleImageError(photo.url)"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="lookbook-empty">
      <p>No images to display</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lookbook-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  min-height: 300px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  max-width: none !important;
}

.lookbook-loading,
.lookbook-error,
.lookbook-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;

  svg {
    max-width: 60px;
    max-height: 60px;
    width: 60px;
    height: 60px;
  }
}

.lookbook-error {
  p {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
}

.retry-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

/* JavaScript-based Masonry Layout */
.lookbook-masonry {
  position: relative;
  width: 100%;
  max-width: 100vw;
  padding: 0.5rem;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }

  @media (min-width: 1200px) {
    padding: 1rem 3rem;
  }

  @media (min-width: 1600px) {
    padding: 1rem 4rem;
  }
}

.lookbook-item {
  /* Position will be set by JavaScript */
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);

  /* Prevent layout shift */
  contain: layout;
}

.lookbook-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0;
  animation: fadeIn 0.6s ease-in forwards;
  transition: transform 0.3s ease, opacity 0.3s ease, filter 0.4s ease;

  /* Blur effect while loading */
  filter: blur(20px);
  transform: scale(1.1);

  /* Remove blur when loaded */
  &.loaded {
    filter: blur(0);
    transform: scale(1);
  }

  /* Hover effect - simple scale (only when loaded) */
  &.loaded {
    .lookbook-item:hover & {
      transform: scale(1.02);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .lookbook-masonry {
    column-gap: 0.5rem;
    padding: 0.5rem;
  }

  .lookbook-item {
    margin-bottom: 0.5rem;
  }

  .lookbook-item:hover .lookbook-image {
    /* Disable hover effect on mobile */
    transform: none;
  }
}
</style>
