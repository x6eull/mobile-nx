import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import Index from './pages/Index/Index'
import index from './navIcon/index.svg'
import schedule from './navIcon/schedule.svg'
import mine from './navIcon/mine.svg'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css'

/* Global stylesheets and theme variables */
import './App.css'
import GradePage from './pages/GradePage/GradePage'
import CourseSchedule from './pages/CourseSchedule/CourseSchedule'

setupIonicReact()

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet animated>
            <Route exact path='/'>
              <Redirect to='/index' />
            </Route>
            <Route exact path='/index'>
              <Index />
            </Route>
            <Route exact path='/schedule'>
              <IonPage>todo</IonPage>
            </Route>
            <Route exact path='/mine'>
              <IonPage>
                <IonRouterLink routerLink='/grade'>grade</IonRouterLink>
                <IonRouterLink routerLink='/courseSchedule'>
                  courseSchedule
                </IonRouterLink>
              </IonPage>
            </Route>
            <Route exact path='/grade'>
              <GradePage />
            </Route>
            <Route exact path='/courseSchedule'>
              <CourseSchedule />
            </Route>
          </IonRouterOutlet>
          <IonTabBar className='app-nav' slot='bottom'>
            <IonTabButton tab='index' href='/index'>
              <IonIcon aria-hidden='true' icon={index} />
              <IonLabel>主页</IonLabel>
            </IonTabButton>
            <IonTabButton tab='schedule' href='/schedule'>
              <IonIcon aria-hidden='true' icon={schedule} />
              <IonLabel>日程</IonLabel>
            </IonTabButton>
            <IonTabButton tab='mine' href='/mine'>
              <IonIcon aria-hidden='true' icon={mine} />
              <IonLabel>我的</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
