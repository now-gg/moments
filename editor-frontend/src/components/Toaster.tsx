import { Toaster as DefaultToaster } from 'react-hot-toast'

const Toaster = () => {
  return (
    <DefaultToaster 
        position="top-center" 
        containerClassName="mt-24" 
        toastOptions={
          {
            success: {
              style: {
                background: '#4FA099',
                color: '#fff',
                fontSize: '14px'
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#4FA099',
              }
            },
            error: {
              style: {
                background: '#DE5A48',
                color: '#fff',
                fontSize: '14px'
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#DE5A48',
              }
            },
            loading: {
              style: {
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '14px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              },
              iconTheme: {
                primary: '#ababab',
                secondary: '#ccc',
              }
            }
          }
      }
      />
  )
}

export default Toaster