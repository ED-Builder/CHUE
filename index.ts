import {
    db, definePlugin, UserModel, Handler, UserNotFoundError, NotFoundError, param, PermissionError, PRIV, Types,
} from 'hydrooj';
class ChangeUsernameHandler extends Handler {
    async get() {
        this.response.template = 'change-username.html'; // 返回此页面
    }
    @param('uidOrName', Types.UidOrName)
    @param('text', Types.String)
    async post(domainId: string, uidOrName: string, text: string) {
        // 检查输入
        let udoc = await UserModel.getByUname(domainId, uidOrName);
        if (!udoc)
            throw new NotFoundError(uidOrName);
        text = text.replace('\'', '').replace('\"', '');
        if (!text)
            throw new NotFoundError('text');
        // 用户名小写
        const Lowtext: string = text.toLowerCase();
        // 构建徽章代码并更新
        await UserModel.setById(udoc._id, { uname: text});
        await UserModel.setById(udoc._id, { unameLower: Lowtext})
        // 将用户重定向到创建完成的url
        this.response.redirect = "/";
    }
}

export async function apply(ctx: Context) {
    ctx.Route('change-username', '/change-username', ChangeUsernameHandler, PRIV.PRIV_CREATE_DOMAIN);
}
