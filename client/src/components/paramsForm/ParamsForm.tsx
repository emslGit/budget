import React, { useRef } from 'react';
import { strings } from '../../utils/strings';
import { IFinanceParams } from '../interfaces';
import styles from './paramsForm.module.css';

interface Props {
  handleUpdateClick(params: IFinanceParams): void;
}

const ParamsForm: React.FC<Props> = ({handleUpdateClick}: Props) => {
  const roiInput = useRef<HTMLInputElement>(null);
  const inflationInput = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    handleUpdateClick({
      roi: roiInput.current ? Number(roiInput.current.value) : 0,
      inflation: inflationInput.current ? Number(inflationInput.current.value) : 0
    });
  }

  return (
    <div className={`${styles.paramsForm} card`}>
      <h2>Parameters</h2>
      <form onSubmit={(ev) => handleFormSubmit(ev)}>
        <div>
          <label>{strings.roi}</label>
          <span>
            <input ref={roiInput} defaultValue="10" type="number"></input>
            <span>%</span>
          </span>
        </div>
        <div>
          <label>{strings.inflation}</label>
          <span>
            <input ref={inflationInput} type="number"></input>
            <span>%</span>
          </span>
        </div>
        <hr></hr>
        <button>Update</button>
      </form>
    </div>
  );
}

export default ParamsForm;
