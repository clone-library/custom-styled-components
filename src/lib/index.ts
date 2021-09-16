import React, { AllHTMLAttributes, ReactHTML } from 'react';

const style = document.createElement('style');
document.head.appendChild(style);

const css = (styles: string) => {
  const index = style.sheet?.cssRules.length;
  const className = `css-${index}`;
  const rule = `.${className} { ${styles} }`;
  style.sheet?.insertRule(rule, index);
  return { className, newRuleIndex: index };
};

interface StylePropsFn<P> {
  (x: P): string;
}

export const styled = (tag: keyof ReactHTML) => {
  return function styledTemplate<P = {}>(
    rules: TemplateStringsArray,
    ...args: StylePropsFn<P>[]
  ): React.FC<P & AllHTMLAttributes<HTMLElement>> {
    return (props) => {
      const resolved = resolveRule<P>(rules, args, props);
      const { className } = css(resolved);
      return React.createElement<P, HTMLElement>(tag, { className, ...props });
    };
  };
};

function resolveRule<P>(
  parts: TemplateStringsArray,
  args: StylePropsFn<P>[],
  props: P
) {
  return parts.reduce((output: string, part: string, index: number) => {
    if (index === parts.length - 1) {
      return output + part;
    }
    return output + part + args[index](props);
  }, '');
}
