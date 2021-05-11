export const buildTree = (data) =>{
    const idMapping = data.reduce((acc, el, i) => {
        acc[el._id] = i;
        return acc;
      }, {});

      let root;
      data.forEach(el => {
        // Handle the root element
        if (!el.parentId) {
          root = el;
          return;
        }
        // Use our mapping to locate the parent element in our data array
        const parentEl = data[idMapping[el.parentId]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el];
      });
    
    return root;
}
export const buidTreeForCrud = (data)=>{
  const idMapping = data.reduce((acc, el, i) => {
    acc[el._id] = i;
    return acc;
  }, {});

  let arrRoot = [];
  data.forEach(el => {
    // Handle the root element
    if (!el.parentId) {
        arrRoot.push(el);
      return;
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = data[idMapping[el.parentId]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el];
  });
  const rootIndeedIndex = arrRoot.findIndex(item=>item.name ==='Root');
  if(rootIndeedIndex >=0 ){
    arrRoot = arrRoot.concat(arrRoot[rootIndeedIndex].children);
    arrRoot.splice(rootIndeedIndex, 1);
  }
  return arrRoot;
}

export const padLeadingZeros =(num, size) => {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}