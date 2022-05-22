(async () => {
    try {
        const res = await fetch("https://shiny-toys-pull-90-43-241-177.loca.lt/", { headers: { "Bypass-Tunnel-Reminder": "true", Accept: "application/json" } });
        const data = await res.json();
        console.log(data);
    } catch (e) {
        console.log(e);
    }
})();
