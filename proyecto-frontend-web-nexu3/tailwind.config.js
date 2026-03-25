/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Colores base
				primary: "var(--color-primary)",
				secondary: "var(--color-secondary)",
				tertiary: "var(--color-tertiary)",
				background: "var(--color-background)",
				
				// Variaciones del color primario
				'primary-light': "var(--color-primary-light)",
				'primary-dark': "var(--color-primary-dark)",
				'primary-accent': "var(--color-primary-accent)",
				
				// Variaciones del color secundario
				'secondary-light': "var(--color-secondary-light)",
				'secondary-dark': "var(--color-secondary-dark)",
				
				// Color de acento
				accent: "var(--color-accent)",
				'accent-light': "var(--color-accent-light)",
				'accent-dark': "var(--color-accent-dark)",
				
				// Colores semánticos
				success: "var(--color-success)",
				warning: "var(--color-warning)",
				error: "var(--color-error)",
				
				// Compatibilidad con nombres anteriores
				"backgorund-color": "var(--color-background)",
			},
			fontFamily: {
				sans: [
					"Nunito",
					"Inter",
					"system-ui",
					"Avenir",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-hero': 'var(--gradient-hero)',
			},
		},
	},
	plugins: [],
};
