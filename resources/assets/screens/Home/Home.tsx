import Logo from 'components/UI/Logo/Logo';
import React from 'react';
import './Home.module.scss';

export default function Home() {
  return (
    <div styleName="wrapper">
      <Logo />
      <div>
        <h1>Hello Tast developer</h1>
        <p>Good luck making the next great thing</p>
      </div>
    </div>
  );
}
