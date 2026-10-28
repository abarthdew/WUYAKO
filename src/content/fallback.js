import fastfood from '../data/fastfood.json';
import missions from '../data/missions.json';
import buttons from '../data/lessons/buttons.json';
import threeSteps from '../data/lessons/three-steps.json';
import pictogram from '../data/lessons/pictogram.json';
import homeLayout from '../data/layouts/home.json';

// API를 쓸 수 없을 때(서버 없이 개발·테스트) 쓰는 번들 콘텐츠. kind → slug → body
export const FALLBACK = {
  theme: { fastfood },
  mission: missions,
  lesson: { buttons, 'three-steps': threeSteps, pictogram },
  layout: { home: homeLayout },
};
