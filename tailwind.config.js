/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,jsx}'];
export const theme = {
    extend: {
        colors: {
            header: "var(--primary)",
            headerText: "var(--white)",
            sidebar: "var(--lavender)",
            sidebarText: "var(--black)",
            canvas: "var(--accent)",
            gridline: "var(--secondary)",
            output: "var(--accent)",
            outputBorder: "var(--secondary)",
            primaryButton: "var(--primary)",
            primaryButtonText: "var(--white)",
            secondaryButton: "var(--secondary)",
            secondaryButtonText: "var(--black)",
            sidebarButton: "var(--secondary)",
            sidebarButtonText: "var(--black)",
            sidebarButtonBorder: "var(--secondary)",
            sidebarButtonHoverBg: "var(--primary)",
            sidebarButtonHoverBorder: "var(--accent)",
            textPrimary: "var(--black)",
            textSecondary: "var(--primary)",
            textAccent: "var(--accent)",
            textMuted: "var(--secondary)",
            textHeader: "var(--black)",
        }
    },
};
export const plugins = [];