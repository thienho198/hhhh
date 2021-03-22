import React, {useState} from 'react';
import '../../../styles/login-input.scss';
import { useController } from "react-hook-form";
import classnames from 'classnames';

const Input = ({ control, name, checkValid, type, error, ...props }) =>{
    const {icon, iconFocus = icon, placeholder} = props;
    const [isFocus, setIsFocus] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const {
        field: { ref, ...inputProps },
        // meta: { invalid, isTouched, isDirty },
      } = useController({
        name,
        control,
        rules: checkValid,
        defaultValue: "",
      });
      //#region events handler
    const onMouseEnter = event=>{
      setIsHover(true);
    }
    const onMouseLeave = event=>{
      setIsHover(false);
    }
    const onFocus = (e) =>{
      setIsFocus(true);
    }
    const onBlur = (e) =>{
      setIsFocus(false);
    }
    //#endregion
    return (
        <div onFocus={onFocus} onBlur={onBlur} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={classnames("login-input-wrapper",{"login-input-wrapper--focus":isFocus, "login-input-wrapper--error":error})}>
            <span className="login-input-wrapper__icon">{isFocus || isHover ? iconFocus : icon}</span>
            <input type={type} className="login-input-wrapper__input" placeholder={placeholder} ref={ref} {...inputProps} />
        </div>
    )
}

export default Input;