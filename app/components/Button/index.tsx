/**
 *
 * Button
 *
 */
import { path } from 'ramda';
import { InterpolationFunction } from 'styled-components';
import styled from 'styles/styled-components';

interface Props {}

const getBlue: InterpolationFunction<any> = path(['theme', 'default', 'blue']);

const Button = styled.button<Props>`
  color: ${getBlue};
  border: 4px solid ${getBlue};
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.5em;
`;

export default Button;
