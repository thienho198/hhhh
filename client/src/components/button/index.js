import React from "react";
import "./style/button.scss";
import classNames from "classnames";

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startEffect: false,
    };
    this.keyRipple = 1;
  }
  //#region events

  onClickHandler = (e) => {
    this.keyRipple = this.keyRipple + 1; // change key to trigger css animate
    const rect = this.btnRef.getBoundingClientRect();
    const button = this.btnRef;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const width = diameter,
      height = diameter;
    const left = e.clientX - (rect.x + radius);
    const top = e.clientY - (rect.y + radius);
    this.setState({
      left: left,
      top: top,
      width: width,
      height: height,
    },()=>{
      setTimeout(()=>{
        this.props.onClick && this.props.onClick(e);
      },0)
    });
   
  };

  //#region logic
  getClassesBtn = () => {
    const { size, disabled, variant, color, className } = this.props;
    return classNames(
      "tigerd-btn",
      `tigerd-btn--${size}size`,
      `tigerd-btn--${variant}--${color}`,
      {"tigerd-btn--disabled": disabled},
      className
      )
  };

  //#region render
  render() {
    const { left, top, width, height } = this.state;
    const {iconLeft, iconRight, children, disabled, color, styleButton, styleIconLeft, styleTitle, styleIconRight,type} = this.props;
    const inner = (
      <React.Fragment>
        <span style={{lineHeight:0, ...styleIconLeft}} className="tigerd-btn__icon-left">{iconLeft}</span>
        <div  style={styleTitle}className="tigerd-btn__title">{children}</div>
        <span style={{lineHeight:0, ...styleIconRight}} className="tigerd-btn__icon-right">{iconRight}</span>
        <span
          key={this.keyRipple}
          className={classNames("tigerd-btn__ripple", `tigerd-btn__ripple--${color}`)}
          style={{
            left: left,
            top: top,
            width: width,
            height: height,
          }}
        />
      </React.Fragment>
    )
    if(type==='input-file')
        return (
                <span
                ref={(ref) => (this.btnRef = ref)}
                onClick={this.onClickHandler}
                className={this.getClassesBtn()}
                style={styleButton}
                disabled={disabled}
              >
                {inner}
              </span>
           )
    else
      return (
        <button
          ref={(ref) => (this.btnRef = ref)}
          onClick={this.onClickHandler}
          className={this.getClassesBtn()}
          style={styleButton}
          disabled={disabled}
        >
          {inner}
        </button>
      );
  }
}

Button.defaultProps = {
  disabled: false,
  size: "small",
  variant: 'texted', // || outlined || contained
  color: 'default', // || primary || secondary,
  styleButton: {},
  styleIconLeft: {},
  styleTitle: {},
  styleIconRight: {},
  className: '',
  type:'button' // || input-file
};
