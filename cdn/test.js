(async () => {
    const res = await fetch("https://open-hands-thank-78-196-22-177.loca.lt", {
        headers: { "Bypass-Tunnel-Reminder": "true", Accept: "application/json", "Access-Control-Allow-Origin": "*" },
    });
    const data = await res.json();
    console.log(data);
})();
