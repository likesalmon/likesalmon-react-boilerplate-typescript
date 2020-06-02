/**
 *
 * PageLink
 *
 */
import { NavLink } from 'react-router-dom';
import styled from 'styles/styled-components';

const activeClassName = 'selected';

const PageLink = styled(NavLink).attrs({ activeClassName })`
  text-decoration: none;
  font-size: 1.5em;
  color: #fff;
  font-weight: bold;
  padding: 0 10px;
  &.${activeClassName} {
    color: gray;
  }
`;

export default PageLink;
