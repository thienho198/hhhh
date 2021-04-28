import React from "react";
import "./menu.scss";
import { ReactComponent as ExpandIcon } from "./icons/RightArrowIcon.svg";
import { ReactComponent as CollapseIcon } from "./icons/DownIcon.svg";
import { ReactComponent as DefaultParentIcon } from "./icons/DefaultParentIcon.svg";
import { ReactComponent as DefaultParentIconActive } from "./icons/DefaultParentIconActive.svg";
import { ReactComponent as HomeIcon } from "./icons/Home.svg";
import { ReactComponent as HomeActive } from "./icons/HomeActive.svg";
import classnames from "classnames";
import  cloneDeep  from "lodash/cloneDeep";
import axios from '../../../axios/mainAxios';
import {MENU} from '../../../config/apis';
import {buildTree} from '../../../utils';
import {withRouter} from 'react-router-dom';
import get from 'lodash/get'

const addKeysToMenu = (mt, parentPath = "") => {
  // console.log("123", mt);
  mt.forEach((data) => {
    if (data.groupName) {
      addKeysToMenu(data.members, parentPath + "/" + data.groupName);
    } else if (data.children) {
      data.keyPath = parentPath + "/" + data.name;
      data.isExpand = false;
      addKeysToMenu(data.children, parentPath + "/" + data.name);
    } else {
      data.keyPath = parentPath + "/" + data.name;
    }
  });

  return mt;
};

const activeMenuItemInitalized = function(menuData, keyPath){
  //active item
  const newMenuItemActive = this.findItemByKeyPath(keyPath, menuData);
  newMenuItemActive && (newMenuItemActive.isActive = true);

  //expand parents
  const arrayKeyPathOld = keyPath.split("/");
  arrayKeyPathOld.pop();
  arrayKeyPathOld.shift();

  arrayKeyPathOld.forEach((key, index) => {
    let keyPathPerItem = "";
    for (let i = 0; i <= index; i++) {
      keyPathPerItem = keyPathPerItem + "/" + arrayKeyPathOld[i];
    }
    const menuItemParent = this.findItemByKeyPath(
      keyPathPerItem,
      menuData
    );
    !menuItemParent.groupName && (menuItemParent.isExpand = true);
  });
  return menuData
}
class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuMetadata: [],
      expandIcon: props.expandIcon || <ExpandIcon width="12" height="12" />,
      collapseIcon: props.collapseIcon || (
        <CollapseIcon width={12} height={12} />
      ),
      activeKeyPath: props.activeKeyPath || "/Admin/Role",
      menuCollapse: props.menuCollapse,
    };
  }

  //#region functions logic
  findItemByKeyPath = (keyPath, updateMetadata) => {
    const arrayDirection = keyPath.split("/");
    arrayDirection.shift();
    let finalMenu;
    if (arrayDirection.length >= 1) {
      finalMenu = updateMetadata.find((item) => {
        return (
          item.name == arrayDirection[0] || item.groupName == arrayDirection[0]
        );
      });
      if (arrayDirection.length >= 2) {
        finalMenu =
          (finalMenu.children &&
            finalMenu.children.find((item) => {
              return item.name == arrayDirection[1];
            })) ||
          (finalMenu.members &&
            finalMenu.members.find((item) => {
              return item.name == arrayDirection[1];
            }));
      }
      if (arrayDirection.length >= 3) {
        finalMenu =
          finalMenu.children &&
          finalMenu.children.find((item) => {
            return item.name == arrayDirection[2];
          });
      }
      if (arrayDirection.length >= 4) {
        finalMenu =
          finalMenu.children &&
          finalMenu.children.find((item) => {
            return item.name == arrayDirection[3];
          });
      }
      return finalMenu;
    }
  };
  toggleMenuParent = (keyPath) => {
    const updateMetadata = cloneDeep(this.state.menuMetadata);
    const finalMenu = this.findItemByKeyPath(keyPath, updateMetadata);
    finalMenu.isExpand = !finalMenu.isExpand;
    this.setState({ menuMetadata: updateMetadata });
  };

  activeMenu = (keyPath, itemData) => {
    this.props.onSelectItem && this.props.onSelectItem(itemData)
    this.props.history.push(itemData.keyPath);
    const updateMetadata = cloneDeep(this.state.menuMetadata);
    //deactive old item
    const oldMenuItemActive = this.findItemByKeyPath(
      this.state.activeKeyPath,
      updateMetadata
    );
    oldMenuItemActive && (oldMenuItemActive.isActive = false);
    //active new item
    const newMenuItemActive = this.findItemByKeyPath(keyPath, updateMetadata);
    newMenuItemActive.isActive = true;

    //deactive old parent menu item

    const arrayKeyPath = this.state.activeKeyPath.split("/");
    arrayKeyPath.pop();
    arrayKeyPath.shift();

    arrayKeyPath.forEach((key, index) => {
      let keyPathPerItem = "";
      for (let i = 0; i <= index; i++) {
        keyPathPerItem = keyPathPerItem + "/" + arrayKeyPath[i];
      }
      const menuItemParent = this.findItemByKeyPath(
        keyPathPerItem,
        updateMetadata
      );
      !menuItemParent.groupName && (menuItemParent.isParentActive = false);
    });

    //active parents menu item
    const arrayKeyPathOld = keyPath.split("/");
    arrayKeyPathOld.pop();
    arrayKeyPathOld.shift();

    arrayKeyPathOld.forEach((key, index) => {
      let keyPathPerItem = "";
      for (let i = 0; i <= index; i++) {
        keyPathPerItem = keyPathPerItem + "/" + arrayKeyPathOld[i];
      }
      const menuItemParent = this.findItemByKeyPath(
        keyPathPerItem,
        updateMetadata
      );
      !menuItemParent.groupName && (menuItemParent.isParentActive = true);
    });
    //end active parents menu item

    this.setState({ menuMetadata: updateMetadata, activeKeyPath: keyPath });
  };

  componentDidMount() {
    axios.get(MENU.get,{params:{page:1,page_size:100, projection:'name requiredTypes parentId'}})
    .then(res=>{
      const keyPathByUrl = get(this.props,'history.location.pathname');
      this.setState({menuMetadata: activeMenuItemInitalized.call(this,addKeysToMenu(buildTree(res.data.data).children),keyPathByUrl), activeKeyPath: keyPathByUrl});
    })
    .catch(err=>{
        console.log(err)
    })
    this.props.linkRef && this.props.linkRef(this);
  }

  //outner functions
  toggleCollapse = () => {
    this.setState((prevState) => {
      return { menuCollapse: !prevState.menuCollapse };
    });
  };

  //#region functions events
  onItemClick = (itemData) => {
    if (this.state.menuCollapse) {
      this.setState((prevState) => {
        return { menuCollapse: !prevState.menuCollapse };
      });
    }

    const updateMetadata = cloneDeep(this.state.menuMetadata);
    const menuParentClick = this.findItemByKeyPath(
      itemData.keyPath,
      updateMetadata
    );
    // check if item is parent
    if (itemData.children || itemData.members) {
      if (!this.state.menuCollapse) {
        this.toggleMenuParent(itemData.keyPath);
        // check if item is expand or not
      } else if (!menuParentClick.isExpand) {
        this.toggleMenuParent(itemData.keyPath);
      }
    } else {
      this.activeMenu(itemData.keyPath, itemData);
    }
  };
  //#region render
  renderParentMenu(parentMenu) {
    const classParentMenuContent = classnames(
      "tigerd-menu__parentmenu__content",
      {
        "tigerd-menu__parentmenu__content--active": parentMenu.isActive,
        "tigerd-menu__parentmenu__content--parentactive":
          parentMenu.isParentActive,
      }
    );
    const classParentListItem = classnames("tigerd-menu__children", {
      "tigerd-menu__children--expand":
        !this.state.menuCollapse && parentMenu.isExpand,
    });

    return (
      <div className="tigerd-menu__parentmenu">
          <div
            onClick={() => this.onItemClick(parentMenu)}
            className={classParentMenuContent}
          >
            {/* {!this.state.menuCollapse && parentMenu.children && (
              <div className="tigerd-menu__parentmenu__content__expandicon">
                {parentMenu.isExpand
                  ? this.state.collapseIcon
                  : this.state.expandIcon}
              </div>
            )} */}
            {/* <div className="tigerd-menu__parentmenu__content__icon">
              {parentMenu.isActive
                ? parentMenu.iconAtive ||
                  parentMenu.icon || (
                    <DefaultParentIconActive width={24} height={24} />
                  )
                : parentMenu.icon || (
                    <DefaultParentIcon width={24} height={24} />
                  )}
            </div> */}
            {!this.state.menuCollapse && (
              <div className="tigerd-menu__parentmenu__content__name">
                {parentMenu.name}
              </div>
            )}
          </div>
        {parentMenu.children && (
          <div className={classParentListItem}>
            {parentMenu.children.map((child) => this.renderChildMenu(child))}
          </div>
        )}
      </div>
    );
  }

  renderChildMenu(childrenMenu) {
    const classChildrenContent = classnames(
      "tigerd-menu__children__childrenmenu__content",
      {
        "tigerd-menu__children__childrenmenu__content--active":
          childrenMenu.isActive,
        "tigerd-menu__children__childrenmenu__content--parentactive":
          childrenMenu.isParentActive,
      }
    );

    const classChildrenListItem = classnames(
      "tigerd-menu__children__childrenmenu__submenus",
      {
        "tigerd-menu__children__childrenmenu__submenus--expand":
          childrenMenu.isExpand,
      }
    );

    return (
      <div className="tigerd-menu__children__childrenmenu">
        <div
          onClick={() => this.onItemClick(childrenMenu)}
          className={classChildrenContent}
        >
          {childrenMenu.children && (
            <div className="tigerd-menu__children__childrenmenu__content__expandicon">
              {childrenMenu.isExpand
                ? this.state.collapseIcon
                : this.state.expandIcon}
            </div>
          )}
          <div className="tigerd-menu__children__childrenmenu__content__name">
            {childrenMenu.name}
          </div>
        </div>
        {childrenMenu.children && (
          <div className={classChildrenListItem}>
            {childrenMenu.children.map((child) => this.renderSubMenu(child))}
          </div>
        )}
      </div>
    );
  }

  renderSubMenu(subMenu) {
    return (
      <div
        onClick={() => this.onItemClick(subMenu)}
        className={classnames(
          "tigerd-menu__children__childrenmenu__submenus__submenu",
          {
            "tigerd-menu__children__childrenmenu__submenus__submenu--active":
              subMenu.isActive,
          }
        )}
      >
        {subMenu.name}
      </div>
    );
  }

  render() {
    const classTigerDMenu = classnames("tigerd-menu", {
      "tigerd-menu--collapse": this.state.menuCollapse,
    });
    return (
      <div className={classTigerDMenu}>
        {this.state.menuMetadata.map((item) => {
          if ("groupName" in item) {
            return (
              <div className="tigerd-menu__group">
                <div className="tigerd-menu__group__name">{item.groupName}</div>
                {item.members.map((member) => this.renderParentMenu(member))}
              </div>
            );
          } else {
            return this.renderParentMenu(item);
          }
        })}
      </div>
    );
  }
}

Menu.defaultProps = {
  menuCollapse: false,
};

export default withRouter(Menu);
