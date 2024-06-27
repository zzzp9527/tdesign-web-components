import { bind, Component, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { TNode } from '../common';
import { TdCollapseProps } from './type';

export type SwitchChangeEventHandler = (value: boolean, event: MouseEvent) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

@tag('t-collapse')
export default class Collapse extends Component<TdCollapseProps> {
  collapseValue = signal([]);

  innerBorderless = signal(false);

  innerDefaultExpandAll = signal(false);

  innerDisabled = signal(false);

  innerExpandIconPlacement: Omi.SignalValue<TdCollapseProps['expandIconPlacement']> = signal('left');

  innerExpandOnRowClick = signal(true);

  @bind
  updateCollapseValue(value) {
    const index = this.collapseValue.value.indexOf(value);
    let newValue = [...this.collapseValue.value];
    if (index >= 0) {
      newValue.splice(index, 1);
    } else if (this.props.expandMutex) {
      newValue = [value];
    } else {
      newValue.push(value);
    }
    this.collapseValue.value = newValue;
    this.props?.onChange?.(newValue);
  }

  provide = {
    getUniqId: (() => {
      let index = 0;
      return () => (index += 1);
    })(),
    collapseValue: this.collapseValue,
    updateCollapseValue: this.updateCollapseValue,
    borderless: this.innerBorderless,
    defaultExpandAll: this.innerDefaultExpandAll,
    collapseProps: this.props,
    disabled: this.innerDisabled,
    expandIconPlacement: this.innerExpandIconPlacement,
    expandOnRowClick: this.innerExpandOnRowClick,
  };

  innerChecked: any = signal(null);

  install(): void {
    const { value, borderless, defaultExpandAll, disabled, expandIconPlacement, expandOnRowClick } = this.props;
    this.collapseValue.value = value || [];
    this.innerBorderless.value = borderless;
    this.innerDefaultExpandAll.value = defaultExpandAll;
    this.innerDisabled.value = disabled;
    this.innerExpandIconPlacement.value = expandIconPlacement || 'left';
    if (typeof expandOnRowClick !== 'undefined') {
      this.innerExpandOnRowClick.value = expandOnRowClick;
    }
  }

  receiveProps(newProps) {
    const { value, borderless, defaultExpandAll, expandIconPlacement, expandOnRowClick, disabled } = newProps;
    value !== undefined && (this.collapseValue.value = value || []);
    borderless !== undefined && (this.innerBorderless.value = borderless);
    defaultExpandAll !== undefined && (this.innerDefaultExpandAll.value = defaultExpandAll);
    disabled !== undefined && (this.innerDisabled.value = disabled);
    expandIconPlacement !== undefined && (this.innerExpandIconPlacement.value = expandIconPlacement || 'left');
    expandOnRowClick !== undefined && (this.innerExpandOnRowClick.value = expandOnRowClick);
    return true;
  }

  render(props: TdCollapseProps): TNode {
    const { className, borderless } = props;

    const classes = classname(`${classPrefix}-collapse`, className, {
      [`${classPrefix}--border-less`]: !!borderless,
    });

    return (
      <div className={classes}>
        <slot></slot>
      </div>
    );
  }
}
