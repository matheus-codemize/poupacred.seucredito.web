import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';

// css
import styles from './style.module.css';

// components
import Button from '../../components/Button';

// utils
import language from '../../utils/language';

function Landing() {
  const history = useHistory();

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.removeEventListener('resize', this);
    window.addEventListener('resize', () => {
      const { innerWidth } = window;
      setWidth(innerWidth);
    });
  }, []);

  useEffect(() => {
    const { advantage_title, advantage, animation_visible } = styles;
    const classes = [advantage_title, advantage];

    if (!navigator.userAgent.toLowerCase().includes('mobile')) {
      $(window).on('scroll', () => {
        classes.forEach(classSelector => {
          $(`.${classSelector}`).each(function () {
            const top_of_object = $(this).offset().top;
            const bottom_of_window = $(window).scrollTop() + $(window).height();
            if (parseInt(bottom_of_window) >= parseInt(top_of_object)) {
              $(this).addClass(animation_visible);
            } else {
              $(this).removeClass(animation_visible);
            }
          });
        });
      });
    }
  }, [
    styles,
    styles.advantage,
    styles.advantage_title,
    styles.animation_visible,
  ]);

  useEffect(() => {
    var index = 0;
    const { step_number, step_number_focus } = styles;
    setInterval(() => {
      if (index === language['landing.steps'].length) {
        index = 0;
      }

      $(`.${step_number}`).each(function (i) {
        if (i === index) {
          $(this).addClass(step_number_focus);
        } else {
          $(this).removeClass(step_number_focus);
        }
      });
      index++;
    }, 2000);
  }, [language, styles, styles.step_number, styles.step_number_focus]);

  function handleSimulation() {}

  function handleClient() {}

  function handleAgent() {}

  return (
    <div className={styles.container}>
      <div className={styles.section_content}>
        <div className={styles.section_header}>
          <h1>{language['landing.title']}</h1>
          <p>{language['landing.subtitle']}</p>
        </div>
        <div className={styles.section_footer}>
          <Button icon="fa-calculator" onClick={handleSimulation}>
            {language['landing.button.simulation.text']}
          </Button>
          <Button icon="fa-user" onClick={handleClient}>
            {language['landing.button.client.text']}
          </Button>
          <Button color="secondary" icon="fa-user-tie" onClick={handleAgent}>
            {language['landing.button.agent.text']}
          </Button>
        </div>
      </div>
      <div className={styles.section_feature}>
        {language['landing.features'].map((feature, index) => {
          return (
            <div key={index} className={styles.feature}>
              <i className={`fa ${feature.icon}`} />
              <h1>{feature.title}</h1>
              {feature.descriptions.map((description, indexD) => (
                <p key={indexD}>{description}</p>
              ))}
            </div>
          );
        })}
      </div>
      <div className={styles.container_step}>
        <h1 className={styles.container_step_title}>
          {language['landing.step.title']}
        </h1>
        <p className={styles.container_step_description}>
          {language['landing.step.subtitle']}
        </p>
        <div className={styles.section_step}>
          {language['landing.steps'].map((step, index) => {
            return (
              <div key={index} className={styles.step}>
                <div
                  className={
                    styles.step_number + ' ' + styles[`step_number${index}`]
                  }
                >
                  {index + 1}
                </div>
                <h1>{step.title}</h1>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.section_advantage}>
        <h1 className={styles.advantage_title}>
          {language['landing.advantage.title']}
        </h1>
        {language['landing.advantages'].map((advantage, index) => {
          return (
            <div key={index} className={styles.advantage}>
              <h1>{advantage.title}</h1>
              <div
                className={styles.advantage_item_description}
                dangerouslySetInnerHTML={{ __html: advantage.description }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Landing;
