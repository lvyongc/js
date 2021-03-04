{
    let topPid = -1; // 顶层pid
    let topId = 0; // 顶层id
    let nowId = 1; // 当前选中项的id
    // console.log(getSelf(topId))
    // console.log(getChild(topId))
    // console.log(getParent(2))
    // console.log(getAllParent(4000))

    /* 数据操作 */ 


    /** 获取 当前项数据
     * Object getSelf(id) 根据id获取对应的当前项数据 *
     * 参数：
     *      id  当前项id
     * 返回值：
     *      当前项数据
    **/ 
    function getSelf(id){
        return data.filter(item=>id==item.id)[0];
    }


    /** 获取子级
     * Array getChild(pid) 根据父级id找到所有直接子级 *
     * 参数：
     *      pid 父级id
     * 返回值：
     *      对应的所有直接子级
    **/
    function getChild(pid){
        return data.filter(item=>pid==item.pid);
    }


    /** 获取父级
     * Object getParent(id) 根据当前项id找到它的父级 *
     * 参数：
     *      id 当前项id
     * 返回值：
     *      对应的父级
    **/
    function getParent(id){
        let s = getSelf(id); // 当前项
        return getSelf(s.pid)// 它的父级
    }


    /** 获取所有父级
     * Array getAllParent(id) 根据当前项id找到它的所有父级 *
     * 参数：
     *      id 当前项id
     * 返回值：
     *      对应的所有父级
    **/
    function getAllParent(id){
        let parent = getParent(id); 
        let allParent = [];
        while(parent){
            allParent.unshift(parent);
            parent = getParent(parent.id);
        }
        return allParent
    }


    /** 
     * Array geiAllChild(id) 根据 id 获取所有子级（包含儿子孙子）
     * 参数：
     *      数据的id
     * 返回值：
     *      所有子数据
    **/
    // console.log(geiAllChild(0))
    function getAllChild(id){
        // 获取直接子级
        let child = getChild(id);
        // 所有子级
        let allChild = [];
        // 直接子级 > 0 说明子级还有子级
        if(child.length > 0){
            // 所有子级 = 所有子级 + 直接子级
            allChild = allChild.concat(child);
            // 直接子级循环每一个 把直接子级的子级加到所有子级里
            child.forEach(item=>{
                // 递归调用geiAllChild 传进去的是每个子级的id
                // 每个子级再去判断有没有下一层子级，全部加到所有子级里
                allChild = allChild.concat(getAllChild(item.id));
            });
        }
        return allChild;
    }


    /** 
     * removeData(id) 根据 id 删除当前项 
     * 参数：
     *      数据的id
    **/
    function removeData(id){
        // 要删除的数据，自己和自己的所有子级
        // 所有子级
        let remove = getAllChild(id);
        // 它自己
        remove.push(getSelf(id));
        // 过滤留下 不是要删除的数据 的数据
        data = data.filter(item=>!remove.includes(item));
        // console.log(data)
    }


    /** 
     * moveData(id,newPid) 根据 id 和新的 pid 修改数据位置，更改它的父级
     * 参数：
     *      id : 数据的id
     *      newPid : 数据的 新的父级 id
    **/
    function moveData(id,newPid){
        // 找到这条数据
        let selfData = getSelf(id);
        // 更改它的Pid
        selfData.pid = newPid;
    }


    /** 
     * testName(id,newName) 检查 id 下的子元素名字 是否 和newName冲突
     * 参数：
     *      id : 数据的id
     *      newName : 新名字
     * 返回值：
     *      true 有冲突     false 没有冲突
    **/
    function testName(id,newName){
        // 所有直接子级
        let child = getChild(id);
        // 有一个是一样，是冲突了
        // some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。
        return child.some(item=>item.title == newName);
    }

    /** 
     * changeChecked(id,checked) 元素选中或不选中
     * 参数：
     *      id : 数据的id
     *      checked : 选中状态
    **/
    function changeChecked(id,checked){
    // 当前项
    let selfData = getSelf(id);
    // 当前项选中状态 = 选中
    selfData.checked = checked;
}


    /** 
     * isCheckedAll() 判断当前视图中数据是否全选
     * 返回值：
     *      true : 全选
     *      false : 不全选
    **/
    function isCheckedAll(){
        // 所有直接子级
        let child = getChild(nowId);
        return child.every(item=>item.checked)&&child.length > 0;
    }

    /** 
     * setAllChecked() 全部选中
     * 参数：
     *      checked : 是否选中
     *      
    **/
    function setAllChecked(checked){
    // 所有直接子级
    let child = getChild(nowId);
    child.forEach(item=>{
        item.checked = checked;
    })
}

    /** 
     * getChecked() 获取当前视图中被选中的数据
     * 返回值：
     *      当前视图选中的数据
     *      
    **/
    function getChecked(){
    // 所有直接子级
    let child = getChild(nowId);
    // 过滤掉 没有选中的
    return child.filter(item=>item.checked)
}

    // 操作是否全选
    // 全选按钮
    let checkedAll = document.querySelector("#checked-all");
    function setCheckedAll(){
        checkedAll.checked = isCheckedAll();
    }
    checkedAll.onchange = function(){
        setAllChecked(this.checked);
        folders.innerHTML = renderFolders();
    }


    /* 视图渲染 */
    // 侧边栏菜单
    let treeMenu = document.querySelector('#tree-menu');
    // 路径导航
    let breadNav = document.querySelector('.bread-nav');
    // 文件夹视图
    let folders = document.querySelector('#folders');

    render();
    // 重新渲染视图
    function render(){
        treeMenu.innerHTML = renderTreeMenu(-1,0);
        breadNav.innerHTML = renderBreadNav();
        folders.innerHTML = renderFolders();
    }

    /* 侧边栏菜单渲染 */
    // level 当前是第几层，初始默认0
    function renderTreeMenu(pid,level,isOpen){
        // isOpen 是否默认打开层级
        // console.log(level)
        // pid是父级的id，传-1的话，找到pid=-1的是微云
        // 下一次传父级的id，就是传pid=-1的id是0，找到pid=0的是文档和音乐
        let child = getChild(pid); // 顶层 微云
        // console.log(child)
        // nowId当前选中项id传进去，找到所有父级
        let nowAllParent = getAllParent(nowId);
        // 加入当前选中的数据
        nowAllParent.push(getSelf(nowId));
        let inner = `
            <ul>
                ${child.map(item=>{
                    // 微云的子级
                    let itemChild = getChild(item.id);
                    // console.log(itemChild)
                    // console.log(item)
                    return `
                        <li class="${(nowAllParent.includes(item)||isOpen)?"open":""}">
                            <p 
                                style="padding-left:${40+level*15}px"
                                class="${itemChild.length?"has-child":""} ${item.id == nowId?"active":""}"
                                data-id="${item.id}"
                            >
                                <span>${item.title} </span>
                            </p>
                            ${itemChild.length?renderTreeMenu(item.id,level+1,isOpen):''}
                        </li>
                    `
                    // item.id是子级的id传给renderTreeMenu拿到id=1的所有子级
                    // map返回的是数组，有间隔，join转成字符串去电间隔
                    // 是否有子级，有递归调用renderTreeMenu函数

                    // style padding left 每一层的缩进
                    // ${itemChild.length?'has-child':''} 是否有子级，有加上class样式
                    // ${item.id == nowId?"active":''} 当前id = 选中项id 就加上class样式
                    // includes() 方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
                    // ${nowAllParent.includes(item)?"open":''} 当前项和它所有的父级是否包含当前项，包含加上class样式
                    // data-id="${item.id}" 自定义属性
                }).join("")} 
            </ul>
        `;
        return inner;
    }

    //* 路径导航渲染 */
    function renderBreadNav(){
        let nowSelf = getSelf(nowId); // 当前
        let allParent = getAllParent(nowId); // 所有父级
        let inner = '';
        allParent.forEach(item=>{
            inner += `<a data-id="${item.id}">${item.title}</a>`  // 父级文本
        });
        inner += `<span>${nowSelf.title}</span>`; // 当前文本
        // 全选
        setCheckedAll();
        return inner;
    }

    /* 文件夹视图渲染 */
    function renderFolders(){
        let child = getChild(nowId); // 当前的子级
        let inner = '';
        child.forEach(item=>{
            inner += `
                <li class="folder-item ${item.checked?"active":''}" data-id="${item.id}">
                    <img src="img/folder-b.png" alt="">
                    <span class="folder-name">${item.title}</span>
                    <input type="text" class="editor" value="${item.title}">
                    <label class="checked">
                        <input type="checkbox" ${item.checked?"checked":""} />
                        <span class="iconfont icon-checkbox-checked"></span>
                    </label>   
                </li>
            `;
        });
        return inner;
    }


    /* 弹窗 */


    // 成功弹窗
    function alertSuccess(info){
        // 获取元素
        let sucC = document.querySelector(".alert-success");
        // 执行先清除
        clearTimeout(sucC.timer);
        // 内容
        sucC.innerHTML = info;
        // 添加class显示出来
        sucC.classList.add("alert-show");
        // 定时器删除class
        sucC.timer = setTimeout(()=>{
            sucC.classList.remove("alert-show");
        },600);
    }

    // 警告弹窗
    function alertWarning(info){
        // 获取元素
        let warning = document.querySelector(".alert-warning");
        // 执行先清除
        clearTimeout(warning.timer);
        // 内容
        warning.innerHTML = info;
        // 添加class显示出来
        warning.classList.add("alert-show");
        // 定时器删除class
        warning.timer = setTimeout(()=>{
            warning.classList.remove("alert-show");
        },600);
    }

    // 阻止页面内容被选中
    // selectstart  选中文字事件
    document.addEventListener("selectstart",function(e){
        // 阻止默认事件
        e.preventDefault();
    })


    /* 三大视图的事件添加 */

    /** 树状菜单操作 **/
    // 使用事件代理 子级都变化的，但是父级一致不变
    treeMenu.addEventListener("click",function(e){
        // 触发元素
        // console.log(e.target)
        let item = e.target.tagName == "SPAN"?e.target.parentNode:e.target;
        // 如果当前触发元素的标签名是span就拿到它的父级（P），否则就是他自己
        // console.log(item)
        // 是P标签就拿到它的id值
        if(item.tagName == "P"){
            // console.log(item.dataset.id);
            // 拿到id给到nowId,就可以重新渲染视图了
            nowId = item.dataset.id;
            // 渲染前删除所有选中状态
            data.forEach(item=>{
                delete item.checked;
            });
            render();
        };
    });

    /** 路径导航操作 **/
    breadNav.addEventListener("click",function(e){
        // console.log(e.target)
        if(e.target.tagName == "A"){
            nowId = e.target.dataset.id;
            // 渲染前删除所有选中状态
            data.forEach(item=>{
                delete item.checked;
            });
            render();
        };
    });


    /** 文件夹视图操作 **/
    folders.addEventListener("click",function(e){
        // console.log(e.target)
        let item = null; 
        if(e.target.tagName == "LI"){
            item = e.target;
        } else if(e.target.tagName == "IMG"){
            // IMG的父级是LI
            item = e.target.parentNode;
        } 
        // else if(e.target.className == "folder-name"){
        //     item = e.target.parentNode;
        // };
        if(item){
            nowId = item.dataset.id;
            // 渲染前删除所有选中状态
            data.forEach(item=>{
                delete item.checked;
            });
            render();
        }
    });

    // 双击名字重命名
    folders.addEventListener("dblclick",function(e){
        // console.log(e.target)
        if(e.target.className == "folder-name"){
            reName(e.target.parentNode);
        }
    });

    // 文件夹选中
    // change 发生改变时
    folders.addEventListener("change",(e)=>{
        // 是否是选中
        if(e.target.type === "checkbox"){
            let id = e.target.parentNode.parentNode.dataset.id;
            // 当前变为选中
            changeChecked(id,e.target.checked);
            // console.log(data)
            // 调用 赋值
            folders.innerHTML = renderFolders();
            // 全选
            setCheckedAll();
        }
    })



    /** 新建文件夹 **/
    let createBtn = document.querySelector(".create-btn");
    createBtn.addEventListener("click",function(){
        data.push({
            id:Date.now(), // 这个id后端处理，这里是模拟，不重复
            pid:nowId,
            title:getName()
        });
        render();
        // 成功弹窗
        // alertSuccess("添加文件夹成功");
        // 警告弹窗
        alertWarning("添加文件夹成功");
    });

    /* 重命名功能 */
    function reName(folder){
        // 名字
        let folderName = folder.querySelector(".folder-name");
        // 编辑框
        let editor = folder.querySelector(".editor");
        // 名字消失
        folderName.style.display = "none";
        // 编辑框显示
        editor.style.display = "block";
        // select 将表单内容选中
        editor.select();
        // onblur 失去焦点时
        editor.onblur = function(){
            // 输入框的名字 = 本来的名字
            if(editor.value === folderName.innerHTML){
                // 什么都没有做，回到之前的状态
                // 名字显示
                folderName.style.display = "block";
                // 编辑框隐藏
                editor.style.display = "none";
                return;
            }
            // trim 去除字符串的头尾空格,并且”截取中间的非空白字符“
            // 不能截取到非空白字符 就是内容为空
            if(!editor.value.trim()){
                alertWarning("请输入新名字");
                // 获取焦点
                editor.focus();
                return;
            }
            // 重命名检测
            if(testName(nowId,editor.value)){
                alertWarning("名字重复，换个名字吧");
                // 获取焦点
                editor.focus();
                return;
            }
            // 成功后
            // 名字显示
            folderName.style.display = "block";
            // 编辑框隐藏
            editor.style.display = "none";
            // 更新左侧菜单的名字
            getSelf(folder.dataset.id).title = editor.value;
            // 渲染视图
            render();
            alertSuccess("重命名成功");
        };
    };


        // 获取新建文件夹的名字
        function getName(){
            // 获取所有子级
            let child = getChild(nowId);
            // 所有子级的title名字
            let names = child.map(item=>item.title);

            // 过滤
            names = names.filter(item=>{
                // 规律1：新建文件夹
                if(item === "新建文件夹"){
                    // 符合规律1，保留
                    return true;
                }
                // console.log(item.substring(0,6),item.substring(6,item.length-1),item.length-1)
    
                // console.log(item.substring(0,6) === "新建文件夹(",Number(item.substring(6,item.length-1)) >= 2,item[item.length-1] == ")")
    
                // 规律2：新建文件夹（num >= 2）
                if(
                    // substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。不包含第end位
                    // substring() 方法用于提取字符串中介于两个指定下标之间的字符。不包含第end位
                    item.substring(0,6) === "新建文件夹("
                    &&Number(item.substring(6,item.length-1)) >= 2
                    &&item[item.length-1] == ")"
                ){
                    return true; // 符合保留
                }
                return false;  // 不符合排除
            });

            // 补位排序
            names.sort((n1,n2)=>{
                n1 = n1.substring(6,n1.length-1);
                n2 = n2.substring(6,n2.length-1);
                // 检测第一个是新建文件夹返回0，否则返回本身
                n1 = isNaN(n1)?0:n1;
                // n2 = isNaN(n2)?0:n2;
                return n1 - n2;
                // console.log(n1,n2)
            });

            // 检测第0位
            if(names[0]!=="新建文件夹"){
                return "新建文件夹";
            };

            // 补缺
            for( let i = 1;i < names.length;i++){
                if(Number(names[i].substring(6,names[i].length-1)) !== i+1){
                    // 不等于 i 是错的
                    // console.log(i,"缺失")
                    // 补位
                    return `新建文件夹(${i + 1})`;
                }
            };

            // 按顺序排序添加对应的数据
            return `新建文件夹(${names.length + 1})`;

        };



    // 右键菜单
    let contextmenu = document.querySelector('#contextmenu');
    // 按下消失
    window.addEventListener("mousedown",function(e){
        contextmenu.style.display = "none";
    });
    // 窗口大小改变消失
    window.addEventListener("resize",function(e){
        contextmenu.style.display = "none";
    });
    // 滚动消失
    folders.addEventListener("scroll",function(e){
        // console.log("滚动")
        contextmenu.style.display = "none";
    });
    // 阻止默认右键菜单
    document.addEventListener("contextmenu",function(e){
        e.preventDefault();
    });
    // 右键菜单按下时阻止冒泡，不让win的按下消失实现
    contextmenu.addEventListener("mousedown",function(e){
        e.stopPropagation();
    });
    // 事件代理方式
    folders.addEventListener("contextmenu",function(e){
        // 找到li
        let folder = null;
        if(e.target.tagName == "LI"){
            folder = e.target;
        } else if(e.target.parentNode.tagName == "LI"){
            folder = e.target.parentNode;
        }
        // 是li就显示右键菜单
        if(folder){
            contextmenu.style.display = "block";
            // 阻止冒泡到父级
            e.stopPropagation();
            e.preventDefault();
            // 右键菜单的位置
            // 鼠标位置
            let l = e.clientX;
            let t = e.clientY;
            // 范围限制，大框宽 - 小框宽
            let maxL = document.documentElement.clientWidth - contextmenu.offsetWidth;
            // 取小值，不超出范围
            l = Math.min(l,maxL);
            let maxT = document.documentElement.clientHeight - contextmenu.offsetHeight;
            t = Math.min(t,maxL);
            // 赋值
            contextmenu.style.left = l + "px";
            contextmenu.style.top = t + "px";

            // 添加自定义属性
            contextmenu.folder = folder;
        };
    });

    // 右键菜单单项处理
    // 按下
    contextmenu.addEventListener("mousedown",function(e){
        e.stopPropagation();
    });
    // 点击
    contextmenu.addEventListener("click",function(e){
        // String类型有一个方法：contains（）,该方法是判断字符串中是否有子字符串。如果有则返回true，如果没有则返回false。

        // 删除
        if(e.target.classList.contains("icon-lajitong")){
            // console.log("删除",this.folder) 
            // console.log(this.folder.dataset.id)
            // removeData(Number(this.folder.dataset.id));
            // removeData(1);
            confirm("确定删除当前文件夹吗？",()=>{
                removeData(Number(this.folder.dataset.id));
                render();
                alertSuccess("删除文件夹成功");
            });
        } 
        // 移动
        else if(e.target.classList.contains("icon-yidong")){
            // console.log("移动")
            // 当前 id
            let id = Number(this.folder.dataset.id);
            // 当前的父级
            let nowPid = getSelf(id).pid;
            // 新的Pid
            // moveData(id,0);
            // render();

            // 确定按钮执行
            moveAlert(()=>{
                // console.log(newPid)
                // 没有移动或者移动到当前的父级，是没有移动位置
                if(newPid === null || nowPid === newPid){
                    alertWarning("您没有移动位置");
                    return false;
                }
                // 所有子级
                let allChild = getAllChild(id);
                // 移动到的元素，新父级
                let newParent = getSelf(newPid);
                // 把它自己也放到所有子级里
                allChild.push(getSelf(id));
                // 它自己和它所有子级里包含了新父级，说明把自己移动到自己或自己的子级里
                if(allChild.includes(newParent)){
                    alertWarning("不能把元素移动到它自己里面");
                    // true 隐藏 false 不隐藏
                    return false;
                }
                // 移动到的重名检测
                if(testName(newPid,getSelf(id).title)){
                    alertWarning("文件夹命名重复了");
                    return false;
                }
                // 移动
                moveData(id,newPid);
                // 更新视图到移动目标位置
                nowId = newPid;
                render();
                alertSuccess("移动成功");
                // true 弹窗消失
                return true;
            })

        } 
        // 重命名
        else if(e.target.classList.contains("icon-zhongmingming")){
            // console.log(this.folder)
            reName(this.folder);
        }
        contextmenu.style.display = "none";
    });


    // 弹窗控件
    // 弹窗 confirm
    let confirmEl = document.querySelector('.confirm');
    // 提示信息
    let confirmText = document.querySelector('.confirm-text');
    // 关闭按钮
    let closConfirm = confirmEl.querySelector('.clos');
    // 遮罩层
    let mask = document.querySelector('#mask');
    // 确定 取消 按钮
    let confirmBtnS = confirmEl.querySelectorAll(".confirm-btns a");

    // 弹窗显示、关闭
    function confirm(info,resolve,reject){
        // resolve,reject 确定和取消  info 提示信息
        // 提示信息
        confirmText.innerHTML = info;
        // 弹窗显示
        confirmEl.classList.add('confirm-show');
        // 遮罩层显示
        mask.style.display = "block";
        // 确定 取消
        // console.log(confirmBtnS)
        confirmBtnS[0].onclick = function(){
            // console.log(123)
            confirmEl.classList.remove('confirm-show');
            mask.style.display = "none";
            resolve&&resolve();
        };
        confirmBtnS[1].onclick = function(){
            confirmEl.classList.remove('confirm-show');
            mask.style.display = "none";
            reject&&reject();
        }
    }
    // 关闭
    closConfirm.addEventListener("click",()=>{
        confirmEl.classList.remove('confirm-show');
        mask.style.display = "none";
    });

    // 移动到 弹窗
    // 找到弹窗
    let moveAlertEl = document.querySelector('.move-alert');
    // 关闭按钮
    let closMoveAlert = moveAlertEl.querySelector('.clos');
    // 确定 取消 按钮
    let moveAlertBtnS = moveAlertEl.querySelectorAll('.confirm-btns a');
    // 弹窗内容
    let moveAlertTreeMenu = moveAlertEl.querySelector('.move-alert-menu');
    let newPid = null;
    // 事件代理找到点击的是谁
    moveAlertTreeMenu.addEventListener("click",function(e){
        let item = e.target.tagName == "SPAN"?e.target.parentNode:e.target;
        // 如果当前触发元素的标签名是span就拿到它的父级（P），否则就是他自己
        

        if(item.tagName == "P"){
            // 找到所有p标签
            let p = moveAlertTreeMenu.querySelectorAll("p");
            // 删除选中状态
            p.forEach(item=>{
                item.classList.remove('active');
            })
            // 添加选中状态
            item.classList.add('active');

            // 拿到id给到newPid,就可以重新渲染视图
            newPid = item.dataset.id;
            render();
        };
    })

    // 关闭按钮
    closMoveAlert.onclick = function(){
        // 隐藏弹窗
        moveAlertEl.classList.remove("move-alert-show");
        // 遮罩层隐藏
        mask.style.display = "none";
    }

    // 弹窗确定 取消
    function moveAlert(resolve,reject){
        // 弹窗内容 = 左侧菜单内容
        // true 默认是打开的
        moveAlertTreeMenu.innerHTML = renderTreeMenu(topPid,0,true);
        // 显示弹窗
        moveAlertEl.classList.add("move-alert-show");
        // 遮罩层显示
        mask.style.display = "block";
        
        // 每次开始重置，防止点开了不做操作，直接关闭，重置保留之前的数据记录
        let newPid = null;
        // 确定 取消 
        moveAlertBtnS[0].onclick = function(){
            if(resolve){
                // 为true才执行下面代码：隐藏
                if(resolve()){
                    // 隐藏弹窗
                    moveAlertEl.classList.remove("move-alert-show");
                    // 遮罩层隐藏
                    mask.style.display = "none";
                };
            } else {
                // 隐藏弹窗
                moveAlertEl.classList.remove("move-alert-show");
                // 遮罩层隐藏
                mask.style.display = "none";
            }
        };
        moveAlertBtnS[1].onclick = function(){
            reject&&reject();
            // 隐藏弹窗
            moveAlertEl.classList.remove("move-alert-show");
            // 遮罩层隐藏
            mask.style.display = "none";
        };
    }


    // 框选
    let selectBox = null;
    folders.addEventListener("mousedown",e=>{
        // 所有 li 文件夹
        let items = folders.querySelectorAll(".folder-item")

        // 0是左键，排除右键的操作
        if(e.button !== 0){
            // 不执行下面代码
            return;
        }
        
        // 鼠标初始值
        let startMouse = {
            x:e.clientX,
            y:e.clientY
        }

        // 获取folders 距离可视区的距离
        let rect = folders.getBoundingClientRect();

        let move = (e)=>{
            // selectBox为 null 的时候再创建元素，避免在元素上画框后，遮盖点击操作，不能点击，提供性能，避免每次点击都会创建
            // 只做点击操作不创建元素
            if(!selectBox){
                // 按下创建div
                selectBox = document.createElement("div");
                selectBox.id = "select-box";
                // 放到 body 里
                document.body.appendChild(selectBox);
            }

            // 鼠标按下移动后的值
            let nowMouse = {
                x:e.clientX,
                y:e.clientY
            };
            // 差值
            let dis = {
                x: nowMouse.x - startMouse.x,
                y: nowMouse.y - startMouse.y
            };
            // 计算坐标
            let minX = Math.min(nowMouse.x,startMouse.x);
            let minY = Math.min(nowMouse.y,startMouse.y);
            let maxX = Math.max(nowMouse.x,startMouse.x);
            let maxY = Math.max(nowMouse.y,startMouse.y);
            // 限制范围
            let l = Math.max(minX,rect.left);
            let t = Math.max(minY,rect.top);
            let r = Math.min(maxX,rect.right);
            let b = Math.min(maxY,rect.bottom);
            // 设置样式
            selectBox.style.left = l + 'px';
            selectBox.style.top = t + 'px';
            // 宽度 = 右边界（右边的最小值） - 左边界（左边的最大值）
            selectBox.style.width = (r - l) + 'px';
            // 高度 = 底边界（下边的最小值） - 上边界（上边的最大值）
            selectBox.style.height = (b - t) + 'px';
            // 
            items.forEach(item=>{
                // 选中按钮
                let checkbox = item.querySelector('[type="checkbox"]');
                // 这里是 DOM 操作 ，不是直接修改了数据
                if(isCollision(item,selectBox)){
                    // true 是碰上了 ，选中
                    item.classList.add("active");
                    checkbox.checked = true;
                } else {
                    item.classList.remove("active");
                    checkbox.checked = false;
                }
                // 数据操作，保留了选中的
                changeChecked(item.dataset.id,checkbox.checked);
            });
            // 全选
            setCheckedAll();
        }
        // 按下
        document.addEventListener("mousemove",move);
        // 抬起
        document.addEventListener("mouseup",()=>{
            // 删除
            document.removeEventListener("mousemove",move);
            if(selectBox){
                document.body.removeChild(selectBox);
                // 删除时 重新回到 null
                selectBox = null;
            }
        },{
            // 只一次
            once:true
        });
    });


    // 碰撞检测
    function isCollision(el,el2){ // 要检测碰撞的2个元素
        // 获取距离可视区的距离
        let elReact = el.getBoundingClientRect();
        let el2React = el2.getBoundingClientRect();
        if(
            // 撞不上
            elReact.top > el2React.bottom
            || el2React.top > elReact.bottom
            || elReact.left > el2React.right
            || el2React.left > elReact.right
        ){
            return false;
        }
        // 撞上了
        return true;
    }

    // 批量删除
    // 删除按钮
    let delBtn = document.querySelector(".del-btn");
    delBtn.addEventListener("click",()=>{
        // 所有选中的数据
        let checkedData = getChecked();
        // 选中才能删除
        if(checkedData.length == 0){
            alertWarning("请选择要操作的文件")
            return;
        }
        confirm("确定删除选中的文件夹吗？",()=>{
            checkedData.forEach(item=>{
                removeData(item.id);
            })
            render();
            alertSuccess("删除文件夹成功");
        });
    });

    // 批量移动
    // 移动按钮
    let moveBtn = document.querySelector(".move-btn");
    moveBtn.addEventListener("click",()=>{
        // 所有选中的数据
        let checkedData = getChecked();
        // 选中才能移动
        if(checkedData.length == 0){
            alertWarning("请选择要操作的文件")
            return;
    };
    // 当前的父级
    let nowPid = nowId;
    // 新的Pid
    // moveData(id,0);
    // render();

    // 确定按钮执行
    moveAlert(()=>{
        // console.log(newPid)
        // 没有移动或者移动到当前的父级，是没有移动位置
        if(newPid === null || nowPid === newPid){
            alertWarning("您没有移动位置");
            return false;
        }
        for(let i = 0;i < checkedData.length;i++){
            // id
            let id = checkedData[i].id;
            // 所有子级
            let allChild = getAllChild(id);
            // 移动到的元素，新父级
            let newParent = getSelf(newPid);
            // 把它自己也放到所有子级里
            allChild.push(checkedData[i]);
            // 它自己和它所有子级里包含了新父级，说明把自己移动到自己或自己的子级里
            if(allChild.includes(newParent)){
                alertWarning("不能把元素移动到它自己里面");
                // true 隐藏 false 不隐藏
                return false;
            }
            // 移动到的重名检测
            if(testName(newPid,checkedData[i].title)){
                alertWarning("文件夹命名重复了");
                return false;
            }
            // 移动
            moveData(id,newPid);
            // 更新视图到移动目标位置
        }
        nowId = newPid;
        render();
        alertSuccess("移动成功");
        // true 弹窗消失
        return true;
    })
    });
};