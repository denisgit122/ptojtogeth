import {Routes, Route, Navigate} from 'react-router-dom'

import {AdminPanelPage, ForgotPasswordPage, LoginPage, NotFoundPage, UserPage, UserPageManager} from "./pages";
import {HeaderLayots} from "./layouts/HeaderLayots/HeaderLayots";
import {AddPasswordPage} from "./pages/AddPasswordPage/AddPasswordPage";
import {HeaderLayotsManager} from "./layouts";

function App() {

  return (
      <div >
        <Routes>

          <Route path={'/'}>
            <Route index element={<Navigate to={'/login'}/> }/>
            <Route path={'/login'} element={<LoginPage/>}/>

          </Route>



          <Route element={<HeaderLayots/>}>
            <Route path={"/orders"} element={<UserPage/>}/>
            <Route path={"/adminPanel"} element={<AdminPanelPage/>}/>
            <Route path={"/adminPanel/:id"} element={<AddPasswordPage/>}/>

          </Route>

          <Route element={<HeaderLayotsManager/>}>
            <Route path={"/manager"} element={<UserPageManager/>}/>
          </Route>


          <Route path={"/forgot/password"} element={<ForgotPasswordPage/>}/>

          <Route path={'*'} element={<NotFoundPage/>}/>

        </Routes>
      </div>


  );
}

export default App;