import React from "react";

export const PageTree = ({ pages }) => {
  console.log(pages);
  return (
    <>
      <ul>
      {
      pages.map((page) => (
        <li key={page.uuid}>
          {page.title}
          {page.ChildPages && page.ChildPages.length > 0 && (
            <PageTree pages={page.ChildPages} />
          )}
        </li>
      ))
      }
    </ul>
     
    </>
  );
};
