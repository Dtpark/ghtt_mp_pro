/**
 * 本文件用于存放与后端通信的 API
 */

// const host = 'bbs.comsenz-service.com'
// discuz论坛域名
const dzHost = 'dz.wangxiaopeng.net'
// const host = 'dz.com'
// http前缀
const httpPre = 'https://'
// const httpPre = 'http://'
// UCenter 域名
const uc = 'uc.wangxiaopeng.net'
// 二开的UCenter API 域名
const api = 'ut.dtpark.top'

const ucUrl = httpPre + uc
const baseUrl = httpPre + dzHost

const apiUrl = httpPre + api + '/'

const dzApiUrl = baseUrl + '/api/mobile/?'
const indexUrl = baseUrl + '/api/mobile/index.php?'
const defaultIcon = baseUrl + "/static/image/common/groupicon.gif";
const userAvatar = ucUrl + "/avatar.php?size=middle&uid=";
const minImgDoc = baseUrl + '/source/plugin/mobile/template/image/xiaochengxu/minimg/'
const config = {
	// 下面的地址配合云端 Server 工作
	dzHost,
	baseUrl,
	dzApiUrl,
	apiUrl,
	defaultIcon,
	userAvatar,
	minImgDoc,

	courseProfile: `${dzApiUrl}module=spacecp_profile&version=4`,
	pollvoteUrl: `${dzApiUrl}module=pollvote&pollsubmit=yes&version=4`,
	polloptionUrl: `${dzApiUrl}module=forummisc&action=viewvote&version=5`,
	forumdisplayUrl: `${dzApiUrl}module=forumdisplay&version=5`,
	searchThreadUrl: `${dzApiUrl}module=threadsearch&&version=4`,
	bestanswerUrl: `${dzApiUrl}module=bestanswer&version=4`,
	saveformidUrl: `${dzApiUrl}module=saveformid&version=4`,
	payInfoUrl: `${dzApiUrl}module=minapp_payment&version=4`,
	postActivity: `${dzApiUrl}module=newactivity&version=4`,
	activitySinupListUrl: `${dzApiUrl}module=forummisc&action=activityapplylist&version=5`,
	activityAppliesUrl: `${dzApiUrl}module=activityapplies&version=5`,
	// 精华主题
	digestUrl: `${indexUrl}module=forumguide&view=digest&version=5`,
	// 最新主题
	newestUrl: `${indexUrl}module=forumguide&view=newthread&version=5`,
	commonLoginUrl: `${dzApiUrl}module=login&version=5&type=minapp`,
	seccodeUrl: `${dzApiUrl}module=secure&version=4`,
	codeImageUrl: `${dzApiUrl}module=seccode&version=5`,
	registerUrl: `${dzApiUrl}module=register&version=5&type=minapp`,
	oauthsUrl: `${dzApiUrl}module=oauths&version=5`,
	unBindThirdUrl: `${dzApiUrl}module=oauths&op=unbind&version=5`,

	loginUrl: `${dzApiUrl}module=code2session&version=5`,
	checkUrl: `${dzApiUrl}module=check&version=5`,
	forumUrl: `${dzApiUrl}module=group&version=5`,
	workListUrl: `${dzApiUrl}module=forumdisplay&action=list&version=5`,
	postInfoUrl: `${dzApiUrl}module=newthread&version=4`,
	postThreadUrl: `${dzApiUrl}module=newthread&topicsubmit=yes&version=4`,
	detailUrl: `${dzApiUrl}module=viewthread&version=5`,
	postReplyUrl: `${dzApiUrl}module=sendreply&replysubmit=yes&version=4`,
	replyWorkUrl: `${dzApiUrl}module=sendreply&comment=yes&commentsubmit=yes&version=4`,
	uploadFileUrl: `${dzApiUrl}module=forumupload&simple=1&version=4`,
	collectUrl: `${dzApiUrl}module=favthread&version=1`,
	unCollectUrl: `${dzApiUrl}module=favorite&version=5&op=delete`,
	sendFlowerUrl: `${dzApiUrl}module=support&version=5`,
	myFavoriteUrl: `${dzApiUrl}module=myfavthread&version=1`,
	myWorkUrl: `${dzApiUrl}module=mythread&version=1`,
	workCountUrl: `${dzApiUrl}module=workinfo&version=4`,
	forumindexUrl: `${dzApiUrl}module=forumindex&version=4`,
	joinClassUrl: `${dzApiUrl}module=forum&action=join&version=5`,
	createClassUrl: `${dzApiUrl}module=forum&action=create&op=group&version=5`,
	groupTypeUrl: `${dzApiUrl}module=forum&m=grouptype&version=5`,
	searchClassUrl: `${dzApiUrl}module=group&version=5`,
	manageClassUrl: `${dzApiUrl}module=forum&action=manage&version=4`,
	updateClassUrl: `${dzApiUrl}module=forum&action=manage&op=group&version=5`,
	exitClassUrl: `${dzApiUrl}module=forum&action=out&version=5`,
	userClassUrl: `${dzApiUrl}module=groupuser&version=5`,
	userAuditUrl: `${dzApiUrl}module=forum&&action=manage&op=checkuser&version=5`,
	userAuditHandlerUrl: `${dzApiUrl}module=forum&action=manage&op=checkuser&version=5`,
	setAdminUrl: `${dzApiUrl}module=forum&action=manage&op=demise&version=5`,
	addAdminUrl: `${dzApiUrl}module=forum&action=manage&op=manageuser&manageuser=true&version=5`,
	rankUrl: `${dzApiUrl}module=rank&version=4`,
	profileUrl: `${dzApiUrl}module=profile&version=4`,
	profileUpdateUrl: `${dzApiUrl}module=profile&mod=spacecp&ac=profile&op=base&version=4`,
	avatarUpdateUrl: `${dzApiUrl}module=uploadavatar&version=2`,
	deleteClassUrl: `${dzApiUrl}module=forum&action=delete&version=5`,
	createTypeUrl: `${dzApiUrl}module=forumtype&action=createtype&version=4`,
	userModifyUrl: `${dzApiUrl}module=groupuser&action=manage&op=manageuser&version=5`,
	threadTypeUrl: `${dzApiUrl}module=threadclass&action=manage&op=threadtype&version=5`,
	deleteModUrl: `${dzApiUrl}module=deletemoderate&version=5`,
	deletePostUrl: `${dzApiUrl}module=deletepost&version=5`,
	deleteSelfPostUrl: `${dzApiUrl}module=deleteselfpost&version=5`,
	commentMoreUrl: `${dzApiUrl}module=viewcomment&version=5`,
	
	tokenUrl: `${apiUrl}v1/token`,
	userInfoUrl: `${apiUrl}v1/user`
}

export default config
