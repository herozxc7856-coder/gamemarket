import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'var(--background)',
                        foreground: 'var(--foreground)',
                        card: {
                                DEFAULT: 'var(--card)',
                                foreground: 'var(--card-foreground)'
                        },
                        popover: {
                                DEFAULT: 'var(--popover)',
                                foreground: 'var(--popover-foreground)'
                        },
                        primary: {
                                DEFAULT: 'var(--primary)',
                                foreground: 'var(--primary-foreground)'
                        },
                        secondary: {
                                DEFAULT: 'var(--secondary)',
                                foreground: 'var(--secondary-foreground)'
                        },
                        muted: {
                                DEFAULT: 'var(--muted)',
                                foreground: 'var(--muted-foreground)'
                        },
                        accent: {
                                DEFAULT: 'var(--accent)',
                                foreground: 'var(--accent-foreground)'
                        },
                        destructive: {
                                DEFAULT: 'var(--destructive)',
                                foreground: 'var(--destructive-foreground)'
                        },
                        border: 'var(--border)',
                        input: 'var(--input)',
                        ring: 'var(--ring)',
                        // Neon colors
                        neon: {
                                cyan: 'var(--neon-cyan)',
                                magenta: 'var(--neon-magenta)',
                                purple: 'var(--neon-purple)',
                                green: 'var(--neon-green)',
                                orange: 'var(--neon-orange)',
                                red: 'var(--neon-red)',
                        },
                        // Glass
                        glass: {
                                DEFAULT: 'var(--glass)',
                                border: 'var(--glass-border)',
                        },
                        chart: {
                                '1': 'var(--chart-1)',
                                '2': 'var(--chart-2)',
                                '3': 'var(--chart-3)',
                                '4': 'var(--chart-4)',
                                '5': 'var(--chart-5)'
                        }
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                boxShadow: {
                        'neon-cyan': '0 0 10px rgba(0, 243, 255, 0.4), 0 0 20px rgba(0, 243, 255, 0.2), 0 0 30px rgba(0, 243, 255, 0.1)',
                        'neon-magenta': '0 0 10px rgba(188, 19, 254, 0.4), 0 0 20px rgba(188, 19, 254, 0.2), 0 0 30px rgba(188, 19, 254, 0.1)',
                        'neon-green': '0 0 10px rgba(0, 255, 136, 0.4), 0 0 20px rgba(0, 255, 136, 0.2)',
                        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                },
                animation: {
                        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                        'gradient-flow': 'gradient-flow 3s ease infinite',
                        'glitch': 'glitch 3s infinite',
                        'float': 'float 3s ease-in-out infinite',
                        'scanline': 'scanline 4s linear infinite',
                },
                keyframes: {
                        'pulse-glow': {
                                '0%, 100%': {
                                        boxShadow: '0 0 5px rgba(0, 243, 255, 0.4), 0 0 10px rgba(0, 243, 255, 0.2)'
                                },
                                '50%': {
                                        boxShadow: '0 0 15px rgba(0, 243, 255, 0.6), 0 0 30px rgba(0, 243, 255, 0.4)'
                                }
                        },
                        'gradient-flow': {
                                '0%': { backgroundPosition: '0% 50%' },
                                '50%': { backgroundPosition: '100% 50%' },
                                '100%': { backgroundPosition: '0% 50%' },
                        },
                        'glitch': {
                                '0%, 100%': {
                                        textShadow: '-2px 0 var(--neon-cyan), 2px 0 var(--neon-magenta)'
                                },
                                '25%': {
                                        textShadow: '2px 0 var(--neon-cyan), -2px 0 var(--neon-magenta)'
                                },
                                '50%': {
                                        textShadow: '-2px 0 var(--neon-magenta), 2px 0 var(--neon-cyan)'
                                },
                                '75%': {
                                        textShadow: '2px 0 var(--neon-magenta), -2px 0 var(--neon-cyan)'
                                }
                        },
                        'float': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-10px)' },
                        },
                        'scanline': {
                                '0%': { transform: 'translateY(-100%)' },
                                '100%': { transform: 'translateY(100%)' },
                        }
                },
                backgroundImage: {
                        'cyber-grid': 'linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)',
                        'cyber-gradient': 'linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta))',
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
