// theme.js

const Theme = {
    // Add CSS styles
    addStyles() {
        // Remove existing style if it exists
        const existingStyle = document.querySelector('style[data-theme]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }

        const style = document.createElement('style');
        style.setAttribute('data-theme', 'dynamic');
        style.textContent = `
            .data-grid {
                width: 100%;
                border: 1px solid ${this.colors.muted};
                border-radius: ${this.colors.borderRadius};
                overflow: hidden;
            }

            /* Grid container styles */
            .grid-container {
                width: 100%;
                max-width: 100vw;
                height: calc(100vh - ${this.spacing.xxl} - ${this.spacing.lg} - ${this.spacing.md} - ${this.spacing.lg} - ${this.spacing.md} - 250px);
                overflow: auto;
                padding: ${this.spacing.md};
                box-sizing: border-box;
            }

            .grid-wrapper {
                min-width: 100%;
                max-width: 100%;
                width: fit-content;
            }
            .data-grid-row {
                transition: background-color ${this.colors.transitionDuration};
                background-color: ${this.colors.background};
                color: ${this.colors.text};
                border-bottom: 1px solid ${this.colors.muted};
            }
            .data-grid-row:last-child {
                border-bottom: none;
            }
            .data-grid-row > div {
                border-right: 1px solid ${this.colors.muted};
            }
            .data-grid-row > div:last-child {
                border-right: none;
            }

            /* Header row styling */
            .data-grid-row.header {
                background-color: ${this.colors.primary};
                color: #fff;
                font-weight: bold;
                border-bottom: 2px solid ${this.colors.secondary};
                padding: ${this.spacing.md};
            }
            .data-grid-row.header > div {
                border-right: 1px solid rgba(255,255,255,0.2);
            }
            .data-grid-row.header > div:last-child {
                border-right: none;
            }

            /* Hover effect for header */
            .data-grid-row.header:hover {
                background-color: ${this.colors.accent};
            }
            .data-grid-row:hover {
                background-color: ${this.colors.highlight};
                color: ${this.colors.text};
            }
            .data-grid-row.selected {
                background-color: ${this.colors.highlight};
                color: ${this.colors.text};
            }
        `;
        document.head.appendChild(style);
    },

    mode: "dark",
    mode: "dark",
  
    icons: {
      upload: "📂",
      download: "📥",
      generate: "🛠",
      clear: "🧹",
      theme: "🌙",
      search: "🔍",
      add: "➕",
      insert: "📑",
      duplicate: "📄",
      delete: "🗑",
      edit: "✏️",
      save: "💾",
      summary: "📊",
      chart: "📈"
    },

    modes: {
      light: {
        background: "#F4F4F4",
        text: "#222222",
        primary: "#4A90E2",
        secondary: "#50E3C2",
        success: "#27AE60",
        danger: "#E74C3C",
        accent: "#FFC107",
        muted: "#888888",
        highlight: "#E3F2FD",
        shadowColor: "rgba(0,0,0,0.1)",
        transitionDuration: "0.3s",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: {
          base: 0,
          dropdown: 1000,
          overlay: 2000,
          modal: 3000,
          toast: 4000
        }
      },
      dark: {
        background: "#1e1e1e",
        text: "#f0f0f0",
        primary: "#2196F3",
        secondary: "#4DD0E1",
        success: "#66BB6A",
        danger: "#EF5350",
        accent: "#FFD54F",
        muted: "#aaaaaa",
        highlight: "#2c3e50",
        shadowColor: "rgba(255,255,255,0.1)",
        transitionDuration: "0.3s",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(255,255,255,0.1)",
        zIndex: {
          base: 0,
          dropdown: 1000,
          overlay: 2000,
          modal: 3000,
          toast: 4000
        }
      }
    },
  
    fonts: {
      base: "Arial, sans-serif",
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif"
    },
  
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
      xxl: "32px",
      xxxl: "40px",
      padding: "12px",
      margin: "40px"
    },

    typography: {
      heading: {
        lineHeight: "1.3"
      },
      body: {
        lineHeight: "1.5"
      }
    },
  
    get colors() {
      return Theme.modes[Theme.mode];
    },
  
    applyGlobalStyles() {
      document.body.style.backgroundColor = Theme.colors.background;
      document.body.style.color = Theme.colors.text;
      document.body.style.fontFamily = Theme.fonts.base;
      document.body.style.transition = "background-color 0.3s, color 0.3s";
    },
  
    // 🆕 Subscribe to theme changes
    subscribe(fn) {
      if (!Theme._subscribers) Theme._subscribers = [];
      Theme._subscribers.push(fn);
    },
  
    setMode(newMode) {
      if (!Theme.modes[newMode]) return;
  
      Theme.mode = newMode;
      Theme.applyGlobalStyles();
  
      // 🔁 Notify all subscribers (e.g., components)
      if (Theme._subscribers) {
        Theme._subscribers.forEach(fn => fn());
      }
  
      // 🔔 Optional external hook
      if (Theme.onModeChange) {
        Theme.onModeChange(newMode);
      }
    }
  };
  