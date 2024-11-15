import {
    db, definePlugin, UserModel, Handler, UserNotFoundError, NotFoundError, param, PermissionError, PRIV, Types,
} from 'hydrooj';

class ChangeUsernameHandler extends Handler {
    // 从URL中获取参数值
    private getUsername(name: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    async get() {
        this.response.template = 'change-username.html'; // 返回此页面
    }
    @param('uidOrName', Types.UidOrName)
    @param('text', Types.String)
    urlValue: string | null = this.getUsername('u');
    async post(domainId: string, uidOrName: string, urlValue: string, text: string) {
        // 检查输入
        let udoc = await UserModel.getByUname(domainId, uidOrName);
        if (!urlValue)
        {
            if (!udoc)
                throw new NotFoundError('你确定这个用户对吗？');
            text = text.replace('\'', '').replace('\"', '');
            if (!text)
                throw new NotFoundError('这个空不写留着我给你写？');
            // 用户名小写
            const Lowtext: string = text.toLowerCase();
            // 修改数据库
            await UserModel.setById(udoc._id, { uname: text});
            await UserModel.setById(udoc._id, { unameLower: Lowtext})
            // 将用户重定向到创建完成的url
            this.response.redirect = "/user-manage?notification=修改成功！";
        }
        // 用户名小写
        const Lowtext: string = urlValue.toLowerCase();
        // 修改数据库
        await UserModel.setById(udoc._id, { uname: urlValue});
        await UserModel.setById(udoc._id, { unameLower: Lowtext})
    }
}

export async function apply(ctx: Context) {
    ctx.Route('change-username', '/change-username', ChangeUsernameHandler, PRIV.PRIV_CREATE_DOMAIN);
}
