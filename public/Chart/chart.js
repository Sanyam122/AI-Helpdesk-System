

  (() => {
    let chartInstance = null;
    let abortController = null;

    const CHART_COLORS = {
      background: "rgba(19, 127, 236, 0.25)",
      border:     "rgba(19, 127, 236, 1)",
      hover:      "rgba(19, 127, 236, 0.45)",
    };

    function setVisibility(id, visible) {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? "block" : "none";
    }

    function destroyChart() {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    }

    async function loadChart() {
      const canvas = document.getElementById("ticketChart");

      // Bug fix: guard against missing element or zero-size container (hidden on mobile)
      if (!canvas || canvas.offsetParent === null) return;

      const userId = canvas.dataset.userId;
      if (!userId) {
        console.warn("ticketChart: no data-user-id set on canvas.");
        return;
      }

      if (abortController) abortController.abort();
      abortController = new AbortController();

      setVisibility("chartLoading", true);
      setVisibility("chartError", false);
      destroyChart();

      try {
        const res = await fetch(
          `/api/tickets/last-7-days?userId=${encodeURIComponent(userId)}`,
          { cache: "no-store", signal: abortController.signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();

        if (!Array.isArray(result.labels) || !Array.isArray(result.data)) {
          throw new Error("Invalid API response shape.");
        }

        setVisibility("chartLoading", false);

        chartInstance = new Chart(canvas, {
          type: "bar",
          data: {
            labels: result.labels,
            datasets: [{
              label: "Tickets Created",
              data: result.data,
              backgroundColor: CHART_COLORS.background,
              borderColor:     CHART_COLORS.border,
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: CHART_COLORS.hover,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400, easing: "easeOutQuart" },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.parsed.y;
                    return ` ${val} ticket${val !== 1 ? "s" : ""}`;
                  },
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  precision: 0, 
                },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
            },
          },
        });

      } catch (err) {
        if (err.name === "AbortError") return; 

        console.error("Chart error:", err);
        destroyChart();
        setVisibility("chartLoading", false);
        setVisibility("chartError", true);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadChart);
    } else {
      loadChart();
    }
  })();
