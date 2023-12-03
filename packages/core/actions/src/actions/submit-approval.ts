import { getRepositoryFromParams } from '../utils';
import { Context } from '../index';
// 用户提交审批
/**
 * 参数输入 业务表 业务编码 提交时间 提交人
 * @param ctx
 * @param next
 */
export const submitApproval = async (ctx: Context, next) => {
  const { resourceName, resourceOf } = ctx.action;
  const repository = getRepositoryFromParams(ctx);
  const { id, updatedById, upddatedId } = ctx.action.params;
  /**
   * 保存业务表的信息 
   */
  /**
   * 查询业务表的节点设置的 节点 审批
   */
  const instance = await repository.findOne({
    filterByTk:resourceOf,
    context: ctx,
  });
  if(instance){
    const { activeIndex } = instance;
    const currentIndex = activeIndex+1;
    /**
     * 查询节点的审批人 审批
     */

  }
  ctx.status = 200;
  await next();


  //   try {
  //     // 获取用户提交的审批信息
  //     const { userId, approvalData } = ctx.action.params;

  //     // 执行提交审批的逻辑
  //     // ...

  //     // 返回成功的响应
  //     res.status(200).json({ message: '提交审批成功' });
  //   } catch (error) {
  //     // 返回错误的响应
  //     res.status(500).json({ message: '提交审批失败', error: error.message });
  //   }
  /**
   * 1、获取用户提交的业务表、查询审批设置业务表设置节点
   * 2、获取用户提交的业务数据的 当前审批索引值 -1 未进入审批流  0 、1、2 审批节点位置
   * 3、根据业务数据审批的索引值获取审批节点的审批人
   * 4、保存审批信息 业务表、业务数据、审批人、审批时间、审批状态、审批意见
   */
};
