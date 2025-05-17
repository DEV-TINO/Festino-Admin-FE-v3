/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: {
            DEFAULT: '#0052CC', // primary-900-dark
          },
          800: {
            DEFAULT: '#0073F0', // primary-900, ring primary-900
            'light-86': 'rgba(0, 115, 240, 0.86)', // primary-900-light, bg color primary-900-light, border primary-900-light
            'light-70': 'rgba(0, 115, 240, 0.7)', // primary-900-lighter, outline primary-900
            'light-50': 'rgba(0, 115, 240, 0.5)', // secondary-700-lighter
            'light-24': 'rgba(0, 115, 240, 0.24)', // border primary-700-dark,
            'light-16': 'rgba(0, 115, 240, 0.16)', // border primary-900-lighter, border primary-700, outline primary-900-light
            'light-12': 'rgba(0, 115, 240, 0.12)', // bg color secondary-800, border-primary-700-light
            'light-8': 'rgba(0, 115, 240, 0.08)', // bg color secondary-700, outline primary-900
            'light-3': 'rgba(0, 115, 240, 0.03)', // bg color secondary-500-light, outline primary-800
          },
          700: {
            DEFAULT: '#4D9DF5', // primary-800
          },
          600: {
            DEFAULT: '#3082f6',
            'light-5': 'rgba(48, 130, 246, 0.05)', // bg primary-500
          },
          500: {
            DEFAULT: '#009afa',
            'light-5': 'rgba(0, 155, 250, 0.05)', // bg primary-700
          },
          400: {
            DEFAULT: '#C5E0FC', // border outline primary-500
          },
          300: {
            DEFAULT: '#DAE8FA', // border primary-600
          },
          200: {
            DEFAULT: '#E6F0FB', // bg color primary-800-light, bg restore, bg color primary-100, primary-200
            dark: '#7E8A97', // bg secondary-700
          },
          50: {
            DEFAULT: '#EBF4FE', // bg secondary-500
          },
        },
        secondary: {
          900: {
            DEFAULT: '#000000',
            'light-3': 'rgba(0, 0, 0, 0.03)', // bg color primary-300-light
          },
          800: {
            DEFAULT: '#222222', // secondary-700
          },
          700: {
            DEFAULT: '#444444', // secondary-700-light, secondary-500
          },
          600: {
            DEFAULT: '#888888', // cancel-light
          },
          500: {
            DEFAULT: '#999999', // bg secondary-900, border secondary-900
            'light-70': 'rgba(153, 153, 153, 0.7)', // secondary-900-light
            'light-50': 'rgba(153, 153, 153, 0.5)', // secondary-900-lighter
          },
          400: {
            DEFAULT: '#B9B9B9', // border primary-200
          },
          300: {
            DEFAULT: '#C7C7C7', // border primary-300
          },
          200: {
            DEFAULT: '#CCCCCC', // cancel
            'light-28': 'rgba(204, 204, 204, 0.28)', // border secondary-500
          },
          150: {
            DEFAULT: '#D7D7D7', // border primary-300-light, border secondary-700, outline primary-300
          },
          100: {
            DEFAULT: '#EEEEEE', // bg secondary-300, border secondary-300
          },
          50: {
            DEFAULT: '#FFFFFF',
            'light-70': 'rgba(255, 255, 255, 0.7)',
          },
        },
        danger: {
          900: {
            DEFAULT: '#BC0B00', // bg danger-dark
          },
          800: {
            DEFAULT: '#F00E00', // danger
            'light-12': 'rgba(240, 12, 0, 0.12)', // danger-light
          },
          700: {
            DEFAULT: '#FF5353', // bg secondary-200
          },
          600: {
            DEFAULT: '#ff6d6d',
            'light-70': 'rgba(255, 109, 109, 0.7)', // bg danger-900-light
            'light-40': 'rgba(255, 109, 109, 0.4)', // outline primary-200, border secondary-200
            'light-5': 'rgba(255, 109, 109, 0.05)', // bg danger-lighter
          },
          50: {
            DEFAULT: '#FBE4E4', // bg danger-700
          },
        },
        success: {
          900: {
            DEFAULT: '#52B043', // bg success-dark
          },
          800: {
            DEFAULT: '#66CF55',
            'light-70': 'rgba(102, 207, 85, 0.7)', // outline primary-700, border success-700-light
            'light-5': 'rgba(102, 207, 85, 0.05)', // bg success-500, border success-500
          },
          50: {
            DEFAULT: '#E2F5E1', // bg success-700, border success-700
          },
        },
      },
      textColor: (theme) => ({
        ...theme('colors'),
      }),
      borderColor: (theme) => ({
        ...theme('colors'),
      }),
      backgroundColor: (theme) => ({
        ...theme('colors'),
      }),
      ringColor: (theme) => ({
        ...theme('colors'),
      }),
      outlineColor: (theme) => ({
        ...theme('colors'),
      }),
      borderWidth: {
        1: '1px',
      },
      borderRadius: {
        '2lg': '0.625rem', //10px
        '3lg': '1rem', //16px
        '2xl': '1.25rem', //20px
        '5xl': '3.125rem', //50px
      },
      fontSize: {
        '3xl': '1.75rem',
        '2xs': '0.625rem', //10px
      },
      fontFamily: {
        pretendard: ['Pretendard Variable'],
        jalnan2: ['jalnan2'],
      },
      boxShadow: {
        primary: '0 1px 0 0 rgba(0, 115, 240, 0.16)',
        secondary: '0 0 12px rgba(0, 0, 0, 0.04)',
      },
      screens: {
        xs: '430px',
        '3xl': '1800px',
      },
      backgroundImage: {
        'order-icon': "url('/icons/orders/order.svg')",
        // booth
        'booth-list': "url('/icons/booths/list.svg')",
      },
      padding: {
        'mobile': '8%',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  important: true,
}