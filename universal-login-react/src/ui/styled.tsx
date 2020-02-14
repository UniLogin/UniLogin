import React, {FunctionComponent, ReactElement} from 'react';

const UNI_LOGIN_PREFIX = 'u';

type PropsOf<T extends readonly string[]> = { [K in T[number]]?: boolean }

interface StyledComponentBuilder<P> {
  (componentName: string): FunctionComponent<P>
  <A extends string>(componentName: string, modifiers: [A]): FunctionComponent<PropsOf<[A]> & P>
  <A extends string, B extends string>(componentName: string, modifiers: [A, B]): FunctionComponent<PropsOf<[A, B]> & P>
  <A extends string, B extends string, C extends string>(componentName: string, modifiers: [A, B, C]): FunctionComponent<PropsOf<[A, B, C]> & P>
  <A extends string, B extends string, C extends string, D extends string>(componentName: string, modifiers: [A, B, C, D]): FunctionComponent<PropsOf<[A, B, C, D]> & P>
  <A extends string, B extends string, C extends string, D extends string, E extends string>(componentName: string, modifiers: [A, B, C, D, E]): FunctionComponent<PropsOf<[A, B, C, D, E]> & P>
  <A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(componentName: string, modifiers: [A, B, C, D, E, F]): FunctionComponent<PropsOf<[A, B, C, D, E, F]> & P>
}

function createStyledBuilder<P extends {className?: string}>(
  element: (props: P) => ReactElement<any>,
): StyledComponentBuilder<P> {
  return function(componentName: string, modifiers: string[] = []) {
    return (props: any) => element({
      ...props,
      className: getClassName(componentName, modifiers, props),
    });
  };
}

function getClassName(
  componentName: string,
  modifiers: readonly string[],
  props: Record<string, any>,
) {
  const enabledModifiers = modifiers.filter(mod => !!props[mod]);
  return [
    `${UNI_LOGIN_PREFIX}-${componentName}`,
    ...enabledModifiers.map(mod => `${UNI_LOGIN_PREFIX}-${componentName}--${mod}`),
    ...(props.className ? [props.className] : []),
  ].join(' ');
}

export const styled = {
  a: createStyledBuilder<JSX.IntrinsicElements['a']>(props => <a {...props} />),
  abbr: createStyledBuilder<JSX.IntrinsicElements['abbr']>(props => <abbr {...props} />),
  address: createStyledBuilder<JSX.IntrinsicElements['address']>(props => <address {...props} />),
  area: createStyledBuilder<JSX.IntrinsicElements['area']>(props => <area {...props} />),
  article: createStyledBuilder<JSX.IntrinsicElements['article']>(props => <article {...props} />),
  aside: createStyledBuilder<JSX.IntrinsicElements['aside']>(props => <aside {...props} />),
  audio: createStyledBuilder<JSX.IntrinsicElements['audio']>(props => <audio {...props} />),
  b: createStyledBuilder<JSX.IntrinsicElements['b']>(props => <b {...props} />),
  base: createStyledBuilder<JSX.IntrinsicElements['base']>(props => <base {...props} />),
  bdi: createStyledBuilder<JSX.IntrinsicElements['bdi']>(props => <bdi {...props} />),
  bdo: createStyledBuilder<JSX.IntrinsicElements['bdo']>(props => <bdo {...props} />),
  big: createStyledBuilder<JSX.IntrinsicElements['big']>(props => <big {...props} />),
  blockquote: createStyledBuilder<JSX.IntrinsicElements['blockquote']>(props => <blockquote {...props} />),
  body: createStyledBuilder<JSX.IntrinsicElements['body']>(props => <body {...props} />),
  br: createStyledBuilder<JSX.IntrinsicElements['br']>(props => <br {...props} />),
  button: createStyledBuilder<JSX.IntrinsicElements['button']>(props => <button {...props} />),
  canvas: createStyledBuilder<JSX.IntrinsicElements['canvas']>(props => <canvas {...props} />),
  caption: createStyledBuilder<JSX.IntrinsicElements['caption']>(props => <caption {...props} />),
  cite: createStyledBuilder<JSX.IntrinsicElements['cite']>(props => <cite {...props} />),
  code: createStyledBuilder<JSX.IntrinsicElements['code']>(props => <code {...props} />),
  col: createStyledBuilder<JSX.IntrinsicElements['col']>(props => <col {...props} />),
  colgroup: createStyledBuilder<JSX.IntrinsicElements['colgroup']>(props => <colgroup {...props} />),
  data: createStyledBuilder<JSX.IntrinsicElements['data']>(props => <data {...props} />),
  datalist: createStyledBuilder<JSX.IntrinsicElements['datalist']>(props => <datalist {...props} />),
  dd: createStyledBuilder<JSX.IntrinsicElements['dd']>(props => <dd {...props} />),
  del: createStyledBuilder<JSX.IntrinsicElements['del']>(props => <del {...props} />),
  details: createStyledBuilder<JSX.IntrinsicElements['details']>(props => <details {...props} />),
  dfn: createStyledBuilder<JSX.IntrinsicElements['dfn']>(props => <dfn {...props} />),
  dialog: createStyledBuilder<JSX.IntrinsicElements['dialog']>(props => <dialog {...props} />),
  div: createStyledBuilder<JSX.IntrinsicElements['div']>(props => <div {...props} />),
  dl: createStyledBuilder<JSX.IntrinsicElements['dl']>(props => <dl {...props} />),
  dt: createStyledBuilder<JSX.IntrinsicElements['dt']>(props => <dt {...props} />),
  em: createStyledBuilder<JSX.IntrinsicElements['em']>(props => <em {...props} />),
  embed: createStyledBuilder<JSX.IntrinsicElements['embed']>(props => <embed {...props} />),
  fieldset: createStyledBuilder<JSX.IntrinsicElements['fieldset']>(props => <fieldset {...props} />),
  figcaption: createStyledBuilder<JSX.IntrinsicElements['figcaption']>(props => <figcaption {...props} />),
  figure: createStyledBuilder<JSX.IntrinsicElements['figure']>(props => <figure {...props} />),
  footer: createStyledBuilder<JSX.IntrinsicElements['footer']>(props => <footer {...props} />),
  form: createStyledBuilder<JSX.IntrinsicElements['form']>(props => <form {...props} />),
  h1: createStyledBuilder<JSX.IntrinsicElements['h1']>(props => <h1 {...props} />),
  h2: createStyledBuilder<JSX.IntrinsicElements['h2']>(props => <h2 {...props} />),
  h3: createStyledBuilder<JSX.IntrinsicElements['h3']>(props => <h3 {...props} />),
  h4: createStyledBuilder<JSX.IntrinsicElements['h4']>(props => <h4 {...props} />),
  h5: createStyledBuilder<JSX.IntrinsicElements['h5']>(props => <h5 {...props} />),
  h6: createStyledBuilder<JSX.IntrinsicElements['h6']>(props => <h6 {...props} />),
  head: createStyledBuilder<JSX.IntrinsicElements['head']>(props => <head {...props} />),
  header: createStyledBuilder<JSX.IntrinsicElements['header']>(props => <header {...props} />),
  hgroup: createStyledBuilder<JSX.IntrinsicElements['hgroup']>(props => <hgroup {...props} />),
  hr: createStyledBuilder<JSX.IntrinsicElements['hr']>(props => <hr {...props} />),
  html: createStyledBuilder<JSX.IntrinsicElements['html']>(props => <html {...props} />),
  i: createStyledBuilder<JSX.IntrinsicElements['i']>(props => <i {...props} />),
  iframe: createStyledBuilder<JSX.IntrinsicElements['iframe']>(props => <iframe {...props} />),
  img: createStyledBuilder<JSX.IntrinsicElements['img']>(props => <img {...props} />),
  input: createStyledBuilder<JSX.IntrinsicElements['input']>(props => <input {...props} />),
  ins: createStyledBuilder<JSX.IntrinsicElements['ins']>(props => <ins {...props} />),
  kbd: createStyledBuilder<JSX.IntrinsicElements['kbd']>(props => <kbd {...props} />),
  keygen: createStyledBuilder<JSX.IntrinsicElements['keygen']>(props => <keygen {...props} />),
  label: createStyledBuilder<JSX.IntrinsicElements['label']>(props => <label {...props} />),
  legend: createStyledBuilder<JSX.IntrinsicElements['legend']>(props => <legend {...props} />),
  li: createStyledBuilder<JSX.IntrinsicElements['li']>(props => <li {...props} />),
  link: createStyledBuilder<JSX.IntrinsicElements['link']>(props => <link {...props} />),
  main: createStyledBuilder<JSX.IntrinsicElements['main']>(props => <main {...props} />),
  map: createStyledBuilder<JSX.IntrinsicElements['map']>(props => <map {...props} />),
  mark: createStyledBuilder<JSX.IntrinsicElements['mark']>(props => <mark {...props} />),
  menu: createStyledBuilder<JSX.IntrinsicElements['menu']>(props => <menu {...props} />),
  menuitem: createStyledBuilder<JSX.IntrinsicElements['menuitem']>(props => <menuitem {...props} />),
  meta: createStyledBuilder<JSX.IntrinsicElements['meta']>(props => <meta {...props} />),
  meter: createStyledBuilder<JSX.IntrinsicElements['meter']>(props => <meter {...props} />),
  nav: createStyledBuilder<JSX.IntrinsicElements['nav']>(props => <nav {...props} />),
  noindex: createStyledBuilder<JSX.IntrinsicElements['noindex']>(props => <noindex {...props} />),
  noscript: createStyledBuilder<JSX.IntrinsicElements['noscript']>(props => <noscript {...props} />),
  object: createStyledBuilder<JSX.IntrinsicElements['object']>(props => <object {...props} />),
  ol: createStyledBuilder<JSX.IntrinsicElements['ol']>(props => <ol {...props} />),
  optgroup: createStyledBuilder<JSX.IntrinsicElements['optgroup']>(props => <optgroup {...props} />),
  option: createStyledBuilder<JSX.IntrinsicElements['option']>(props => <option {...props} />),
  output: createStyledBuilder<JSX.IntrinsicElements['output']>(props => <output {...props} />),
  p: createStyledBuilder<JSX.IntrinsicElements['p']>(props => <p {...props} />),
  param: createStyledBuilder<JSX.IntrinsicElements['param']>(props => <param {...props} />),
  picture: createStyledBuilder<JSX.IntrinsicElements['picture']>(props => <picture {...props} />),
  pre: createStyledBuilder<JSX.IntrinsicElements['pre']>(props => <pre {...props} />),
  progress: createStyledBuilder<JSX.IntrinsicElements['progress']>(props => <progress {...props} />),
  q: createStyledBuilder<JSX.IntrinsicElements['q']>(props => <q {...props} />),
  rp: createStyledBuilder<JSX.IntrinsicElements['rp']>(props => <rp {...props} />),
  rt: createStyledBuilder<JSX.IntrinsicElements['rt']>(props => <rt {...props} />),
  ruby: createStyledBuilder<JSX.IntrinsicElements['ruby']>(props => <ruby {...props} />),
  s: createStyledBuilder<JSX.IntrinsicElements['s']>(props => <s {...props} />),
  samp: createStyledBuilder<JSX.IntrinsicElements['samp']>(props => <samp {...props} />),
  script: createStyledBuilder<JSX.IntrinsicElements['script']>(props => <script {...props} />),
  section: createStyledBuilder<JSX.IntrinsicElements['section']>(props => <section {...props} />),
  select: createStyledBuilder<JSX.IntrinsicElements['select']>(props => <select {...props} />),
  small: createStyledBuilder<JSX.IntrinsicElements['small']>(props => <small {...props} />),
  source: createStyledBuilder<JSX.IntrinsicElements['source']>(props => <source {...props} />),
  span: createStyledBuilder<JSX.IntrinsicElements['span']>(props => <span {...props} />),
  strong: createStyledBuilder<JSX.IntrinsicElements['strong']>(props => <strong {...props} />),
  style: createStyledBuilder<JSX.IntrinsicElements['style']>(props => <style {...props} />),
  sub: createStyledBuilder<JSX.IntrinsicElements['sub']>(props => <sub {...props} />),
  summary: createStyledBuilder<JSX.IntrinsicElements['summary']>(props => <summary {...props} />),
  sup: createStyledBuilder<JSX.IntrinsicElements['sup']>(props => <sup {...props} />),
  table: createStyledBuilder<JSX.IntrinsicElements['table']>(props => <table {...props} />),
  tbody: createStyledBuilder<JSX.IntrinsicElements['tbody']>(props => <tbody {...props} />),
  td: createStyledBuilder<JSX.IntrinsicElements['td']>(props => <td {...props} />),
  textarea: createStyledBuilder<JSX.IntrinsicElements['textarea']>(props => <textarea {...props} />),
  tfoot: createStyledBuilder<JSX.IntrinsicElements['tfoot']>(props => <tfoot {...props} />),
  th: createStyledBuilder<JSX.IntrinsicElements['th']>(props => <th {...props} />),
  thead: createStyledBuilder<JSX.IntrinsicElements['thead']>(props => <thead {...props} />),
  time: createStyledBuilder<JSX.IntrinsicElements['time']>(props => <time {...props} />),
  title: createStyledBuilder<JSX.IntrinsicElements['title']>(props => <title {...props} />),
  tr: createStyledBuilder<JSX.IntrinsicElements['tr']>(props => <tr {...props} />),
  track: createStyledBuilder<JSX.IntrinsicElements['track']>(props => <track {...props} />),
  u: createStyledBuilder<JSX.IntrinsicElements['u']>(props => <u {...props} />),
  ul: createStyledBuilder<JSX.IntrinsicElements['ul']>(props => <ul {...props} />),
  "var": createStyledBuilder<JSX.IntrinsicElements['var']>(props => <var {...props} />),
  video: createStyledBuilder<JSX.IntrinsicElements['video']>(props => <video {...props} />),
  wbr: createStyledBuilder<JSX.IntrinsicElements['wbr']>(props => <wbr {...props} />),
  webview: createStyledBuilder<JSX.IntrinsicElements['webview']>(props => <webview {...props} />),
};
