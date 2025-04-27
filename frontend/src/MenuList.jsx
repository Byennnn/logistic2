import { Menu } from "antd";
import {HomeOutlined, AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import { Link } from "react-router-dom"


const MenuList = () => {
    return(
        <Menu theme="light" mode="inline" className="menu-bar">
            <Menu.Item key="home" icon={<HomeOutlined />}>
                HOME
            </Menu.Item>
            <Menu.SubMenu key="Activity" icon={<AppstoreOutlined />} title="Activity">
            <Link to="/Warehouse"><Menu.Item key="warehouse1">Warehouse</Menu.Item></Link>
            <Link to="/Inventory"><Menu.Item key="warehouse2">Inventory</Menu.Item></Link>
            <Link to="/Transportation"><Menu.Item key="warehouse3">Transportation</Menu.Item></Link>
            </Menu.SubMenu>
            <Menu.Item key="setting" icon={<SettingOutlined />}>
                Setting
            </Menu.Item>
            <br></br>
            <Link to="/Users" className='btn btn-success'>Sign Out</Link>
        </Menu>
    );
};

export default MenuList