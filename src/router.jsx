
import {
    createBrowserRouter
  } from "react-router-dom";


  import App from './App.jsx'



  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children:[
        // {
        //   path: "/contacts",
        //   element: <Contacts/>,
        // },
        // {
        //   path:"/invoices",
        //   element:<Invoices/>
        // },
        // {
        //   path:"/bar",
        //   element:<Bar/>
        // },
        // {
        //   path:"/pie",
        //   element:<Pie/>
        // },
        // {
        //   path:"/team",
        //   element:<Team/>
        // },
        // {
        //   path:"/geography",
        //   element:<Team/>
        // },
        // {
        //   path:"/faq",
        //   element:<FAQ/>
        // },
    

      ]
    },
    
  ]);

  export default router;
