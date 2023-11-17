import React from 'react'
import { useParams } from 'react-router-dom';

export const Checking = () => {

  // const {params,slug,}
  // const {slug, "*": wildcardValue } = useParams();
  const params = useParams()
  console.log(params["*"]);
  console.log(params.uuid);
  console.log(params.slug);


  return (
    <div>Checking</div>
  )
}
