
import HomePage from '../pages/home.f7.html';
import FollowingPage from '../pages/following.f7.html';
import WatchingPage from '../pages/watching.f7.html';
import MessagesPage from '../pages/messages.f7.html';
import UserPage from '../pages/user.f7.html';
import SettingsPage from '../pages/settings.f7.html';
import ChannelPage from '../pages/channel.f7.html';
import ContentPage from '../pages/content.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/following',
    component: FollowingPage,
  },
  {
    path: '/watching',
    component: WatchingPage,
  },
  {
    path: '/messages',
    component: MessagesPage,
  },
  {
    path: '/channel/:id',
    component: ChannelPage,
  },
  {
    path: '/user/:id',
    component: UserPage,
  },
  {
    path: '/content/:id',
    component: ContentPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;