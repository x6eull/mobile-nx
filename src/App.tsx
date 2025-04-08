import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import Home from './pages/Index/Index'
import Tab2 from './pages/Index/components/OtherPages/Schedule'
import Tab3 from './pages/Index/components/OtherPages/Todos'
import home from './navLogo/home.svg'
import schedule from './navLogo/schedule.svg'
import todo from './navLogo/todos.svg'
import functions from './navLogo/functions.svg'
import mine from './navLogo/mine.svg'

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
import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

setupIonicReact()

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/schedule">
              <Tab2 />
            </Route>
            <Route path="/todos">
              <Tab3 />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/home">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>主页</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/schedule">
              <IonIcon aria-hidden="true" icon={schedule} />
              <IonLabel>日程</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/todos">
              <IonIcon aria-hidden="true" icon={todo} />
              <IonLabel>待办</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/functions">
              <IonIcon aria-hidden="true" icon={functions} />
              <IonLabel>功能</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab5" href="/mine">
              <IonIcon aria-hidden="true" icon={mine} />
              <IonLabel>我的</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
