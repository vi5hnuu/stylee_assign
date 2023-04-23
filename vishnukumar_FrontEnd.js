/*
  prop-types : npm package
  runtime type checking for React props and similar objects.

  You can use prop-types to document the intended types of properties passed to components. React (and potentially other libraries—see the checkPropTypes() reference below) will check props passed to your components against those definitions, and warn in development if they don’t match.
*/

// Note: Modified code is provided at the end with  explaination of why modification required to get better understanding of whats goiing on.

/*
Explaination :

WrappedSingleListItem : this component accept props with parameter names as index, isSelected, onClickHandler, text and returns 'li' element which has background color 'green' if the 'isSelected' parameter is true else 'red' it also has an onlclick property which trigger the 'onClickHandler' when this component is click (i.e this 'li' element is clicked)

........................................................................

WrappedSingleListItem.propTypes = {
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

Here we are using the package  `import PropTypes from 'prop-types';`
which restrict the parameters of the 'WrappedSingleListItem' component to be of specific type that is :

index -> number
isSelected -> bool
onClickHandler -> must be function and is non nullable
text -> string and must be non nullable

........................................................................

const SingleListItem = memo(WrappedSingleListItem);

we are using the react memo to kind of store the 'WrappedSingleListItem' so that it only re renders when the below given properties change 
{ index, isSelected, onClickHandler, text, } else no need to rerender which increases the performance incase the component is big and doing expensive things.

........................................................................
//List Component

WrappedListComponent : this component expects a parameter named 'items'
and return an unordered list ('ul') element which has style with 'textAlign' to 'left'

The unordered list dynamically create 'SingleListItem' using the map function on the received 'items' from the props which return the array of the 'SingleListItem' component. The map return our previously created component 'SingleListItem' and to this we assign our props 

index -> index(parameter that map callback provides built-in) of item in items and that is of number type as per prop-type defined for this component above.

text -> item object has text property which is assigned to 'text' that is of string type as per prop-type defined for this component above and for this component defined by the below code.

WrappedListComponent.propTypes = {
  items: PropTypes.array(PropTypes.shapeOf({
    text: PropTypes.string.isRequired,
  })),
};

which says that items must be an array which has text property of string type and is isRequired (cannot be null)

onClickHandler -> () => handleClick function which accept index as arg defined in the same component

isSelected -> selectedIndex which we are taking from useState() and we should pass isSelected={isSelected===index} becuase the 'SingleListItem' restrict it to be of boolean type only and we want to chage color of selected item only.

useEffect has dependencies of items (props param) which means it runs initially and whenever this 'items' prop changes and set the selectedIndex to null

handleClick set the selectedIndex to index (the param of this function) whenever <li> element is clicked (defined above inside WrappedSingleListItem component)

Note : there is serious problem here with useState

useState returns the [the value,and the dispatcher to update the value] but as we can see in the component :

const [setSelectedIndex, selectedIndex] = useState();

we are mistakenly defining 'setSelectedIndex' as first arg and thinking that this is the dispatcher but infact it is the value and the second arg is actually the dispatcher.

updated component :
  const [selectedIndex,setSelectedIndex] = useState();

    useEffect(() => {
      setSelectedIndex(null);
    }, [items]);

    const handleClick = index => {
      setSelectedIndex(index);
    };

:: no more warnings

WrappedListComponent.defaultProps = {
  items: null,
}; 

the above restriction tells that the items can be null (if no items param is passed)

const List = memo(WrappedListComponent);

we memo the 'WrappedListComponent' component and only re-render it if the items prop changes else no re-render should be there...

finaly we export this List component
*/


// Update Components (updated wherever required)
// -------------------------------------------------

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

// Single List Item
const WrappedSingleListItem = ({
  index,
  isSelected,
  onClickHandler,
  text,
}) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? 'green' : 'red' }}
      onClick={() => { onClickHandler(index) }} //must be called when clicked and not when mounted so i created an arrow function.
    >
      {text}
    </li>
  );
};

WrappedSingleListItem.propTypes = {
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const SingleListItem = memo(WrappedSingleListItem);

// List Component
const WrappedListComponent = ({
  items,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(); //swapped the params inside destructuring

  useEffect(() => {
    setSelectedIndex(null);
  }, [items]);

  const handleClick = index => {
    setSelectedIndex(index);
  };

  return (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, index) => (
        <SingleListItem
          key={index} //key is required by react to increase/optomize the performance of the the component although passing index as key is not recommended we can instead use some package to generate unique uuid instead.

          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex === index} //we pass result as boolean if this component is selected or not.
        />
      ))}
    </ul>
  )
};

/*
Note :
  As per 'prop-types' documentation we will get error :
  'Calling PropTypes validators directly is not supported by the `prop-types` package.
Use PropTypes.checkPropTypes() to call them.'

   when we migrate from React.PropTypes to the prop-types package.

   so we can use 'PropTypes.checkPropTypes({})' to resolve the issue... 
*/
WrappedListComponent.propTypes = {
  items: PropTypes.array(PropTypes.shapeOf({
    text: PropTypes.string.isRequired,
  })),
};

WrappedListComponent.defaultProps = {
  items: null,
};


const List = memo(WrappedListComponent);

export default List;

