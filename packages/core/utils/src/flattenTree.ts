
export const flattenTree = (tree, result = []) =>{
    for (const node of tree) {
      result.push(node);
      if (node.children) {
        flattenTree(node.children, result);
      }
    }
    return result;
  }