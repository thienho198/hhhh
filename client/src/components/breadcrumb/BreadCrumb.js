import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function ActiveLastBreadcrumb(props) {
  const arrPath = props.keyPath.split('/');
  arrPath.shift();
  const breadcrumbData = arrPath.map((path,index)=>{
      let href="";
    for(let i =0 ; i<= index; i++){
        href = href + '/' + arrPath[i];
    }
    return {
        href: href,
        name: path
    }
  })
  return (
    <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbData.map((item,index)=>{
            return (
                <Link key={index} color={index == breadcrumbData.length - 1 ? "textPrimary" : "inherit"} href={item.href}>
                  {item.name}
                </Link>
            )
        })}
    </Breadcrumbs>
  );
}
