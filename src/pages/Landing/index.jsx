/* eslint-disable camelcase */
import React, { useMemo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';

// css
import styles from './style.module.css';

// components
import Button from '../../components/Button';

// utils
import language from '../../utils/language';

const bannersDesktop = [
  require('../../assets/images/landing/desktop/banner1.png'),
  require('../../assets/images/landing/desktop/banner2.png'),
  require('../../assets/images/landing/desktop/banner3.png'),
];

const bannersMobile = [
  require('../../assets/images/landing/desktop/banner1.png'),
  require('../../assets/images/landing/desktop/banner2.png'),
  require('../../assets/images/landing/desktop/banner3.png'),
];

function Landing() {
  const history = useHistory();

  /**
   * State para controle das animações JS
   */
  const [indexBanner, setIndexBanner] = useState(0);
  const [intervalBanner, setIntervalBanner] = useState(null);
  const [indexStep, setIndexStep] = useState(0);
  const [intervalStep, setIntervalStep] = useState(null);

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.removeEventListener('resize', this);
    window.addEventListener('resize', () => {
      const { innerWidth } = window;
      setWidth(innerWidth);
    });

    /**
     * Iniciando as animações
     */
    initIntervalBanner();
    initIntervalStep();
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
    navigator.userAgent,
  ]);

  useEffect(() => {
    const selectors = ['slider_item', 'selector_item'];

    selectors.forEach(selector =>
      $(`.${styles[selector]}`).each(function (i) {
        if (i === indexBanner) {
          $(this).addClass(styles[`${selector}_active`]);
        } else {
          $(this).removeClass(styles[`${selector}_active`]);
        }
      }),
    );
  }, [indexBanner]);

  useEffect(() => {
    const { step_number, step_number_active } = styles;
    $(`.${step_number}`).each(function (i) {
      if (i === indexStep) {
        $(this).addClass(step_number_active);
      } else {
        $(this).removeClass(step_number_active);
      }
    });
  }, [indexStep]);

  function initIntervalBanner() {
    const idInterval = setInterval(setBanner, 5000);
    setIntervalBanner(idInterval);
    return () => clearInterval(idInterval);
  }

  function restartIntervalBanner() {
    clearInterval(intervalBanner);
    initIntervalBanner();
  }

  async function setBanner(index) {
    if (index !== undefined) {
      setIndexBanner(index);
      return restartIntervalBanner();
    }

    setIndexBanner(prevIndex =>
      prevIndex === bannersDesktop.length - 1 ? 0 : prevIndex + 1,
    );
  }

  function initIntervalStep() {
    const idInterval = setInterval(setStep, 5000);
    setIntervalStep(idInterval);
    return () => clearInterval(idInterval);
  }

  function restartIntervalStep() {
    clearInterval(intervalStep);
    initIntervalStep();
  }

  function setStep(index) {
    if (index !== undefined) {
      setIndexStep(index);
      return restartIntervalStep();
    }

    setIndexStep(prevIndex =>
      prevIndex === language['landing.steps'].length - 1 ? 0 : prevIndex + 1,
    );
  }

  function handleSimulation() {}

  function handleClient() {}

  function handleAgent() {}

  const renderTitle = useMemo(() => {
    if (indexBanner < language['landing.banners'].length) {
      const { title, subtitle, position } = language['landing.banners'][
        indexBanner
      ];
      return (
        <div
          id="container-title"
          className={styles.container_title}
          style={
            width >= 700
              ? {
                  transform: `translateX(${position})`,
                }
              : {}
          }
        >
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      );
    }
    return <></>;
  }, [width, indexBanner]);

  return (
    <div className={styles.container}>
      <section className={styles.section_header}>
        {bannersDesktop.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`banner${index}`}
            className={styles.slider_item}
          />
        ))}
        {renderTitle}
        <div className={styles.container_action}>
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
        <div className={styles.container_selector}>
          {bannersDesktop.map((_banner, index) => (
            <div
              key={index}
              onClick={() => setBanner(index)}
              className={styles.selector_item}
            />
          ))}
        </div>
      </section>
      <section className={styles.container_step}>
        <h1 className={styles.container_step_title}>
          {language['landing.step.title']}
        </h1>
        <p className={styles.container_step_description}>
          {language['landing.step.subtitle']}
        </p>
        <div className={styles.section_step}>
          {language['landing.steps'].map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.step_number}>{index + 1}</div>
              <h1>{step.title}</h1>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.section_advantage}>
        <h1 className={styles.advantage_title}>
          {language['landing.advantage.title']}
        </h1>
        {language['landing.advantages'].map((advantage, index) => (
          <div key={index} className={styles.advantage}>
            <h1>{advantage.title}</h1>
            <div
              className={styles.advantage_item_description}
              dangerouslySetInnerHTML={{ __html: advantage.description }}
            />
          </div>
        ))}
      </section>
      <section className={styles.section_feature}>
        {language['landing.features'].map((feature, index) => (
          <div key={index} className={styles.feature}>
            <i className={`fa ${feature.icon}`} />
            <h1>{feature.title}</h1>
            {feature.descriptions.map((description, indexD) => (
              <p key={indexD}>{description}</p>
            ))}
          </div>
        ))}
      </section>
      <section className={styles.section_footer}>
        <div className={styles.container_term_policy}>
          <h1>{language['header.title']}</h1>
          <ul>
            {language['landing.footer'].links.map((link, index) => (
              <li key={index}>
                <a href={link.url} className={styles.footer_link}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.container_contacts}>
          {language['landing.footer'].contacts.map((contact, index) => (
            <div key={index}>
              <i className={`fa ${contact.icon}`} />
              <div dangerouslySetInnerHTML={{ __html: contact.text }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landing;
