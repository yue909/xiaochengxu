<?php
/**

 * ============================================================================
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和使用 .
 * 不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * Author: yue909
 * Date: 2018-06-23
 */

namespace Home\Controller;


use Think\Controller;
class ApiController extends Controller {
    
    /**
 * error code 说明.
 * <ul>

 *    <li>-41001: encodingAesKey 非法</li>
 *    <li>-41003: aes 解密失败</li>
 *    <li>-41004: 解密后得到的buffer非法</li>
 *    <li>-41005: base64加密失败</li>
 *    <li>-41016: base64解密失败</li>
 * </ul>
 */
    public static $OK = 0;
    public static $IllegalAesKey = -41001;
    public static $IllegalIv = -41002;
    public static $IllegalBuffer = -41003;
    public static $DecodeBase64Error = -41004;
    // 小程序
    public static $appid = 'wxc8b804b5dc6c2f8e';
    public static $secret = 'c4f89416ee0312a07db26cb469f55b9f';
    public $sessionKey ='';

    // 获取openId session-key 等
    public function getopenId($value='')
    {   

        $code = I('post.code');
        $appid = self::$appid;
        $secret = self::$secret;
        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid='. $appid.'&secret='.$secret.'&js_code='.$code.'&grant_type=authorization_code';
        $result = httpGet($url);
        $res = json_decode($result);
        // session(['sessionKey'=>$res,'expire'=>7200]);
        $this->ajaxReturn($res);

        
    }

    // 或取小程序手机号
    public function getPhoneNumber($value='')
    {   

       $encryptedData = I('get.encryptedData');
       $iv = I('get.iv');
       $this->sessionKey=I('get.session_key');
       $res = $this->decryptData($encryptedData, $iv);
       // $res = json_decode($res);
       if($res->phoneNumber){
            $this->object($res->phoneNumber);
       }
       
       $this->ajaxReturn(['msg'=>$res,'status'=>'1']);
        
    }

    // 小程序解密
   public function decryptData($encryptedData, $iv)
    {
        if (strlen($this->sessionKey) != 24) {
            return self::$IllegalAesKey;
        }
        $aesKey=base64_decode($this->sessionKey);

        
        if (strlen($iv) != 24) {
            return self::$IllegalIv;
        }
        $aesIV=base64_decode($iv);

        $aesCipher=base64_decode($encryptedData);

        $result=openssl_decrypt( $aesCipher, "AES-128-CBC", $aesKey, 1, $aesIV);

        $dataObj=json_decode( $result );
        if( $dataObj  == NULL )
        {
            return self::$IllegalBuffer;
        }
        if( $dataObj->watermark->appid != self::$appid )
        {
            return self::$IllegalBuffer;
        }

        return  $dataObj;
        // return self::$OK;
    }

    // 获取accessToken
    public function accessToken()
    {   
        //公众号 appid 和秘钥
        $appid = 'wxa6124505106149b3';
        $appsecret = '5b8d750ff723df7fd8a10b2b1add2256';
        // AppID 和 AppSecret 可登录微信公众平台官网-设置-开发设置中获得（需要已经绑定成为开发者，且帐号没有异常状态）
        $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$appsecret;
        $res = httpGet($url);
        $res = json_decode($res);
        session(array('accessToken'=>$res->access_token,'expire'=>7200));
        // dump($res->access_token);
        return $res->access_token;

    }

    // 获取小程序模板库标题列表
    public function mptitle()
    {   
        $access_token = session('accessToken')?session('accessToken'):$this->accessToken();
        $url ='https://api.weixin.qq.com/cgi-bin/wxopen/template/library/list?access_token='.$access_token;
        $res = httpPost($url);
        $res = json_encode($res);
        dump($res);
        return $res;
    }

    public function shuju($value='')
    {

        $data = array();
        $data['count'] = M('Company')->where('zizhu=1')->count();
        $map['total_money']  = array('NEQ','0');
        $money = M('Company')->where($map)->field('total_money')->select();
        $a=0;
        foreach ($money as $key => $value) {
            // dump($value);
            $a += $value['total_money'];
        }
        $data['money']=$a;

        $this->ajaxReturn(['msg'=>$data,'status'=>1]);
    }
    /*
     * 获取地区
     */
    public function getRegion(){
        $parent_id = I('get.parent_id');
        $selected = I('get.selected',0);        
        $data = M('region')->where("parent_id=$parent_id")->select();
        $html = '';
        if($data){
            foreach($data as $h){
            	if($h['id'] == $selected){
            		$html .= "<option value='{$h['id']}' selected>{$h['name']}</option>";
            	}
                $html .= "<option value='{$h['id']}'>{$h['name']}</option>";
            }
        }
        echo $html;
    }
    
    // 获取城市
    public function getTwon(){
    	$parent_id = I('get.parent_id');
    	$data = M('region')->where("parent_id=$parent_id")->select();
    	$html = '';
    	if($data){
    		foreach($data as $h){
    			$html .= "<option value='{$h['id']}'>{$h['name']}</option>";
    		}
    	}
    	if(empty($html)){
    		echo '0';
    	}else{
    		echo $html;
    	}
    }
    
    /*
     * 获取分类
     */
    public function get_category(){
        $parent_id = I('get.parent_id'); // 商品分类 父id  
            $list = M('goods_category')->where("parent_id = $parent_id")->select();
        
        foreach($list as $k => $v)
            $html .= "<option value='{$v['id']}'>{$v['name']}</option>";        
        exit($html);
    }  
    
    /**
     * 检测手机号是否已经存在
     */
    public function issetMobile()
    {
      $mobile = I("mobile",'0');  
      $users = M('users')->where("mobile = '$mobile'")->find();
      if($users)
          exit ('1');
      else 
          exit ('0');      
    }

    // 是手机或者是邮箱
    public function issetMobileOrEmail()
    {
        $mobile = I("mobile",'0');
        $user_where['email'] = $mobile;
        $user_where['mobile'] = $mobile;
        $user_where['_logic'] = 'OR';
        $users = M('users')->where($user_where)->find();
        if($users)
            exit ('1');
        else
            exit ('0');
    }

    // 搜索公司
   public function searchCompany(){
        header("Content-Type:text/html;charset=utf-8");
        // header("Access-Control-Allow-Origin: *");
        if(IS_POST){

                $keyword = I('post.keyword');
                $map['Name'] = array('like','%'.$keyword.'%');
                // $sql =" select id  from tp_company where  Name like "."'%".$keyword."%'"." order by id desc limit 0,5";
                // $result = M()->query( $sql );
                $result = M('company')->field('id,Name,OperName,StartDate,Status,Address,Address2,EconKind,RegistCapi')->where($map)->limit(6)->select();
                if ($result) {
                    $this->ajaxreturn(['msg'=>$result,'status'=>1]);
                }else{
                    $this->ajaxreturn(['msg'=>$result,'status'=>0]);
                }
           
            
        }

    }

    public function companydetail(){
        header("Content-Type:text/html;charset=utf-8");
        // header("Access-Control-Allow-Origin: *");
        if(IS_POST){

            $id=I('post.id')?I('post.id'):1457;
            $company  = M('company')->where(['id'=>$id])->find();
            $this->ajaxreturn($company);
            
            }

    }

    //小程序计算器条件
    public function conditions()
    {   
        header("Content-Type:text/html;charset=utf-8");
        // if(IS_POST){
            $result1 = M('condition_category')->where("id=25")->select();
            $result1[0]['cate']=  M('condition_list')->where("cid=25")->select();

            $result2 = M('condition_category')->where("id=9")->select();
            $result2[0]['cate']=  M('condition_list')->where("cid=9")->select();
     
            $result= M('condition_category')->select();
            foreach ($result as $key => $value) {
                // dump($value['id']);

                 if(empty(M('condition_list2')->where("cid={$value['id']}")->select())){
                    unset($result[$key]);
                    
                 }else{
                    $result[$key]['cate']= M('condition_list2')->where("cid={$value['id']}")->select();
                 }
            }

            // dump($result);
            $result = array_merge( $result1,$result,$result2);
            $this->ajaxreturn(['msg'=>$result,'status'=>'1']);
        // }
    }

    // 首页文章
    public function indexArticle($value='')
    {
         $article= M('Article')->order('add_time desc')->limit(10)->field('title,article_id,article_type,cat_name2,click,add_time')->select();
         foreach ($article as $key => $value) {
             $article[$key]['add_time'] = date('Y-m-d', $value['add_time']);
              if (empty($article[$key]['cat_name2'])){
                $article[$key]['cat_name2']='中小企业服务署';
            }
            $rand =  rand(1,16);
             $article[$key]['rand']= $rand;
         }
         $this->ajaxreturn(['msg'=>$article,'status'=>'1']);
    }

    // AJAX获取文章列表 
    public function ajaxGetArticle(){
        $model= M('Article');
        $article = $model->page($_POST['p'],10)->order("add_time desc")->field('title,article_id,article_type,cat_name2,click,add_time')->select();
        foreach(  $article as $key=>$value){
            $article[$key]['add_time']=date('Y-m-d',$value['add_time']);
            if (empty($article[$key]['cat_name2'])){
                $article[$key]['cat_name2']='中小企业服务署';

            }
            $rand =  rand(1,16);
            $article[$key]['rand']= $rand;
        }
        $this->ajaxreturn(['msg'=>$article,'status'=>'1']);
    
    }

    // 文章列表首页
    public function articleList(){

        $count =  M('Article')->count();
        // $Page  = new Page($count,10);
        // $show = $Page->show();
        $article = M('Article')->order('add_time desc')->page($_GET['p'],10)->field('title,article_id,article_type,cat_name2,click,add_time')->select();
        foreach ($article as $key => $value) {
            $article[$key]['content']=strip_tags( $article[$key]['content']);
            $article[$key]['content'] = trim(mb_substr($article[$key]['content'],0,100,'utf-8'));

        }

        $this->ajaxreturn(['msg'=>$article,status=>1,'page'=>$count]);
        

    }
    
    // 文章详情
     public function articleDetail(){

            $article_id = I('get.article_id');
            M('article')->where(array("article_id"=>$article_id))->setInc('click');
            $detail = M('article')->where(array("article_id"=>$article_id))->find();        
            $this->ajaxreturn(['msg'=>$detail,'status'=>1]);
    }

    // 资助列表
    public function fundingCompany(){
  

        
    }
       //ajax获取项目列表
    public function ajaxCompanyList(){
        // if(IS_POST){
            $model = M('company');
            $map = array();
            $data = I('post.');
            if($data['key']){ //关键字
                $map['Name']=array('like','%'.$data['key'].'%');
            }
//            金额
            if($data['money']!=''){
                if ($data['money']=='0'){
                    $map['total_money']='0';
                }elseif($data['money']=='10000+'){
                    $map['total_money'] = array('EGT',10000);
                }else{
                    $data2=explode('-',$data['money']);
                    $data2[0]=intval($data2[0]);
                    $data2[1]=intval($data2[1]);
                    $map['total_money'] = array('BETWEEN',$data2);
                }
            }
//            区域
            if ($data['zone']){
                $map['address | address2']=array('like','%'.$data['zone'].'%');
            }
//            年份
            if($data['year']){
                if ($data['year']=='10+'){
                    $data3 = time()-intval($data['year'])*365*24*60*60;
                    $map['StartDate']=array('ELT', $data3);
                }else{
                    $data3=explode('-',$data['year']);
                    $data4[0]=time()- intval($data3[1])*365*24*60*60;
                    $data4[1]=time()- intval($data3[0])*365*24*60*60;
                    $map['StartDate'] = array('BETWEEN',$data4);
                }
            }
//            高新
            if ($data['gg']) {
                $map['gaoxin'] =$data['gg'];
            }
//            新三板
            if($data['xinsanban']){
                $map['xinsanban'] = $data['xinsanban'];
            }
//            上市
            if($data['shangshi']){
                $map['shangshi'] = $data['shangshi'];
            }
//            行业
            if($data['industry']){
                $map['industry|Scope'] = array('LIKE','%'.$data['industry'].'%');
            }
            $map['zizhu']='1';
            $count = $model->where($map)->limit(100)->count();
            if( $count>=100){
                $count = 100;
            }else{
                $count = $model->where($map)->limit(100)->count();
            }
            $Page  = new AjaxPage($count,10);
            if($Page->totalRows>=100){
                $Page->totalRows="100+";
            }
            $show = $Page->show();
            if($_GET['p']<=100){
                $result = $model->where($map)->page($_GET['p'],10)->order("total_money desc")->select();
                foreach($result as $key=>$value){
                    $result[$key]['Name'] = str_cut($result[$key]['Name'],18);
                    $result[$key]['Name'] = str_replace($keyword, '<span style="color:#1baf8d;font-size:16px;">'.$keyword.'</span>', $result[$key]['Name']);
                    if(M('ObjectFunding')->where(array('company_id'=>$value['id']))->find()){
//                        $result[$key]['z'] = 1;
                        $money = 0;
                        $object = M('ObjectFunding')->where(array('company_id'=>$value['id']))->select();
                        foreach($object as $k=>$v){
                            $money += str_replace(',','',$v['money']);
                        }
                        $result[$key]['money'] = number_format($money,2);
                        if(empty($result[$key]['total_money']) && $result[$key]['money']!='0.00' ){
                            $sql = "update tp_company set total_money=".$result[$key]['money'] ." where id=".$value['id'];
                            $res = M('company')->execute($sql);
                        }
                    }
                }
            }
            $this->assign('result',$result);
            $this->ajaxreturn(['msg'=>$result,'status'=>1]);
            
        // }
    }


     public function object($mobile)
     {
      header("Content-Type:text/html;charset=utf-8");
      // dump( M('board')->select());
      

        $data['user_id']=session('user_id')?session('user_id'):'';
        $data['mobile'] = $mobile;
         $data['content'] = '来源：小程序登录';
        $data['add_time'] = time();
        $data['ip_address'] = get_client_ip();
        $data['status'] = '1';
        // dump($data);
        // 12个小时内不能重复提交五次
      
        // $this->ajaxReturn($starttime);
   
     
        
           $board = M('board')->add($data);
           if ($board) {
             
               return '1';
           }else{
                return '0';
           }
       

      
     


    }

    public function test()
    {   
         header("Content-Type:text/html;charset=utf-8");
        dump(M('company')->count());
    }

}
