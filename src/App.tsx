import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
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

/* Theme variables */
import './App.css'

setupIonicReact()

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
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
              <IonPage>todo</IonPage>
            </Route>
          </IonRouterOutlet>
          <IonTabBar className='app-nav' slot='bottom'>
            <IonTabButton tab='tab1' href='/index'>
              <IonIcon aria-hidden='true' icon={index} />
              <IonLabel>主页</IonLabel>
            </IonTabButton>
            <IonTabButton tab='tab2' href='/schedule'>
              <IonIcon aria-hidden='true' icon={schedule} />
              <IonLabel>日程</IonLabel>
            </IonTabButton>
            <IonTabButton tab='tab5' href='/mine'>
              <IonIcon aria-hidden='true' icon={mine} />
              <IonLabel>我的</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
