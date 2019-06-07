<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<!-- Required meta tags -->
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<!-- Bootstrap CSS -->
<link rel="stylesheet"
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<title>메인</title>
<script type="text/javascript"
	src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js"
	charset="utf-8"></script>
<script type="text/javascript"
	src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js"
	charset="utf-8"></script>
<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.js"></script>


<style>
* {
	margin: 0 auto;
}

.fixedMenu {
	position: fixed;
	background: #fff;
	z-index: 999;
}

.fixedMenuNav {
	background: #007bff;
}

.fixedMenu .nav-link {
	color: #fff;
	font-weight: bold;
}

.jumbotron {
	padding-top: 180px;
	background: #b8daff;
}

.mainPage {
	margin-top: -32px;
	background: #F2F2F2;
}

.carousel-indicators>li {
	width: 15px;
	height: 15px;
	border-radius: 50%;
}

.myCard {
	border: none;
}

head>.nav-item {
	width: 15%;
	heigth: 100%;
}

.nav-item:hover {
	text-decoration-line: underline;
}

.nav-tabs .nav-link {
	color: #000;
	font-weight: bold;
}

.tab-pane {
	padding: 30px;
	background: #fff;
	border-radius: 0 0 5px 5px;
	border-left: 1px solid #ddd;
	border-right: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
}

.myTitle {
	text-align: left;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.myTitle a {
	color: black;
}

.myTitle a:hover {
	color: black;
	font-weight: bold;
}

.tabStuff {
	font-size: 13px;
	color: #555;
}

.myBanner img {
	paddingtop: 10px;
	width: 90%;
	height: 250px;
	border-radius: 50%;
}

.footer {
	background: #b8daff;
}

.more {
	text-align: right;
}

a[class="moreBtn"] {
	color: black;
}

a:hover[class="moreBtn"] {
	color: black;
	font-weight: bold;
}

.carousel_h3 {
	color: green;
	font-family: 'Gamja Flower', cursive;
}

#kaLogout {
	border: 0px;
	padding: 0px;
}

#naLogout {
	border: 0px;
	padding: 0px;
}
</style>
<script>
   $(function() {
      $("#emailLogout").on("click", function() {
    	  location.href = "logout.me";
      });
      $("#getPw").on("click", function() {
         var width=(window.screen.width/2)-(600/2);
         var height=window.screen.height/2-400/2;
         open("getPw.me", "_brank", "width=600px,height=400px,left="+width+",top="+height);
      });
      $("#signUp_btn").on("click", function() {
         location.href = "signUpGo.me";
      });
      $(".mPageGo").on("click", function() {
         location.href = "mPageGo.me?currentPage=1";
      });
      $("#storeSerchBtn").on("click", function() {
         var width=window.screen.width/2-800/2;
         var height=window.screen.height/2-600/2;
         open("goStoreSerch.win", "_brank","width=800px,height=600px,left="+width+",top="+height);
      });
      $(".withdrawalBtn").on("click", function() {
         var width=window.screen.width/2-600/2;
         var height=window.screen.height/2-600/2;
         open("goWithdrawal.me", "_brank", "width=600px,height=600px,left="+width+",top="+height);
      });
      $("#adminPage").on("click", function() {
         location.href = "goAdmin.admin";
      });
      $("#supportBtn").on("click", function() {
         var width=window.screen.width/2-900/2;
         var height=window.screen.height/2-600/2;
         open("goSupport.su", "_brank", "width=900px,height=600px,left="+width+",top="+height);
      });
      $(".infoBtn").on("click",function(){
    	 $(".moreBtn").attr("href","list.board03?noticeCurrentPage=1");
      });	 
       $(".freeBtn").on("click",function(){
          $(".moreBtn").attr("href","list.board01?freeCurrentPage=1"); 
      });
       $(".qnaBtn").on("click",function(){
          $(".moreBtn").attr("href","list.board02?qnaCurrentPage=1");
      });
       $("#kaLogout").on("click",function(){
    	   $.ajax({
    		   url:"logout.ka",
    		   type:"get"
    	   }).done(function(){
    		   var kakao=open("https://developers.kakao.com/logout", "_blank", "width=100,height=100");
    		   setTimeout(function(){
    			   kakao.close();
    			   location.reload(true);
    		   },1000);
    	   });
       });//"https://developers.kakao.com/logout"
		$("#naLogout").on("click",function(){
			$.ajax({
	    		   url:"logout.na",
	    		   type:"get"
	    	   }).done(function(){
	    		   var naver=open("https://nid.naver.com/nidlogin.logout?returl=https://www.naver.com/", "_blank", "width=100,height=100");
	    		   setTimeout(function(){
	    			   naver.close();
	    			   location.reload(true);
	    		   },1000);
	    	   });//https://nid.naver.com/nidlogin.logout?returl=https://www.naver.com/
       });
   });
</script>
</head>
<body>

	<!-- 고정메뉴 -->
	<div class="container-fluid fixedMenu">
		<div class="row fixedMenuNav p-2">
			<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
			<div class="col-lg-8 col-md-9 col-sm-12 col-xs-12">
				<ul class="nav justify-content-center head">
				<li class="nav-item"><a class="nav-link active" href="goMain.win">메인페이지</a></li>
					<li class="nav-item"><a class="nav-link" href="startGame.kiosk">학습하기</a></li>
					<li class="nav-item"><a class="nav-link" href="goInfo.win">사이트 소개</a></li>
					<li class="nav-item"><a class="nav-link" href="list.board03?noticeCurrentPage=1">공지사항</a></li>
                        <li class="nav-item"><a class="nav-link" href="list.board01?freeCurrentPage=1">자유게시판</a></li>
                        <li class="nav-item"><a class="nav-link" href="list.board02?qnaCurrentPage=1">문의하기</a></li>
					<c:if test="${type==4}">
						<li class="nav-item"><a class="nav-link" href="goAdmin.admin">관리자 페이지</a></li>
					</c:if>
				</ul>
			</div>
			<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
		</div>
		<div class="row p-1">
			<div class="col-lg-4 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
			<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
				<div class="input-group mt-3 mb-3">
					<input type="search" class="form-control" placeholder="검색어를 입력하세요"
						aria-label="Search">
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" type="button"
							id="button-addon2">찾아보기</button>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
		</div>
	</div>
	<!--    점보트론 -->
	<div class="jumbotron jumbotron-fluid">
		<div class="container">
			<div class="row startPage">
				<div
					class="col-lg-6 col-md-12 col-sm-12 col-xs-12 pb-5 pr-2 text-center">
					<h1 class="display-4 font-weight-bold pt-2">시작하기</h1>
					<p class="lead font-weight-bold pb-2">새로운 디지털 기술을 체험하고 이웃들과
						공유하세요!</p>
					<hr class="my-4">
					<p class="pb-2">
						처음 방문하셨나요? <br> 아래 버튼을 누르시면 여러가지 사이트 소개를 볼 수 있습니다
					</p>
					<a class="btn btn-primary btn-lg mr-2" href="goInfo.win"
						role="button">소개보기</a> <a class="btn btn-primary btn-lg" href="startGame.kiosk"
						role="button">체험 시작하기</a>
				</div>
				<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 text-center">
					<iframe width="95%" height="315"
						src="https://www.youtube.com/embed/1BzqctRGgaU" frameborder="0"
						allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen></iframe>
				</div>
			</div>
		</div>
	</div>
	<!--    본문 -->
	<div class="container mainPage pt-2">
		<div class="row mb-5">
			<!--    슬라이드 -->
			<div
				class="col-lg-8 col-md-12 col-sm-12 col-xs-12 order-lg-1 order-2">
				<div class="bd-example">
					<div id="carouselExampleCaptions" class="carousel slide"
						data-ride="carousel">
						<ol class="carousel-indicators">
							<li data-target="#carouselExampleCaptions" data-slide-to="0"
								class="active"></li>
							<li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
							<li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
						</ol>
						<div class="carousel-inner">
							<div class="carousel-item active">
								<img src="Resources/img/carousel1.jpg " class="d-block w-100 "
									alt="slide_img1" width="350px" height="400px">
								<div class="carousel-caption d-none d-md-block ">
									<h3 class="carousel_h3">노인을 위한 세상은 없다</h3>
									<p>
										<a
											href="http://www.mediatoday.co.kr/news/articleView.html?mod=news&act=articleView&idxno=148319"
											target="_blank">기사 바로가기</a>
									</p>
								</div>
							</div>
							<div class="carousel-item">
								<img src="Resources/img/carousel2.jpg" class="d-block w-100"
									alt="slide_img2" width="350px" height="400px">
								<div class="carousel-caption d-none d-md-block">
									<h3 class="carousel_h3">햄버거 던지고... 무인주문기계 '키오스크'가 펼친 지옥도</h3>
									<p>
										<a
											href="http://www.ohmynews.com/NWS_Web/Event/Premium/at_pg.aspx?CNTN_CD=A0002535977&CMPT_CD=P0010&utm_source=naver&utm_medium=newsearch&utm_campaign=naver_news"
											target="_blank"> 기사 바로가기 </a>
									</p>
								</div>
							</div>
							<div class="carousel-item">
								<img src="Resources/img/carousel3.jpg" class="d-block w-100"
									alt="slide_img3" width="350px" height="400px">
								<div class="carousel-caption d-none d-md-block">
									<h3 class="carousel_h3">"사람보다 기계가 편해" 비대면 쇼핑·결제 부상</h3>
									<p>
										<a
											href="https://view.asiae.co.kr/news/view.htm?idxno=2019052710552826120"
											target="_blank">기사 바로가기</a>
									</p>
								</div>
							</div>
						</div>
						<a class="carousel-control-prev" href="#carouselExampleCaptions"
							role="button" data-slide="prev"> <span
							class="carousel-control-prev-icon" aria-hidden="true"></span> <span
							class="sr-only">Previous</span>
						</a> <a class="carousel-control-next" href="#carouselExampleCaptions"
							role="button" data-slide="next"> <span
							class="carousel-control-next-icon" aria-hidden="true"></span> <span
							class="sr-only">Next</span>
						</a>
					</div>
				</div>
			</div>
			<!--    로그인 폼 -->
			<div
				class="col-lg-4 col-md-12 col-sm-12 col-xs-12 order-lg-2 order-1 text-center pt-3 pb-5 login">
				<c:choose>
					<c:when test="${type==1}">
						<form>
						<div style="border-radius: 10px; background: #b8daff; height: 250px">
							<div class="form-group pb-1 1 pt-5 pb-2" style="font-size: 1.4em">
								<label for="comment"><strong>${nickname}</strong>님
										환영합니다! </label>
							</div>
							<button type="button"
								class="btn btn-outline-secondary mr-2 mPageGo">마이페이지</button>
							<button type="button"
								class="btn btn-outline-secondary mr-2 withdrawalBtn">회원탈퇴</button>
							<br> <br>
							<button type="button" id="naLogout">
								<img height="49" width="150" src="Resources/img/nlogout.PNG" />
							</button>
							</div>
						</form>
					</c:when>
					<c:when test="${type==2}">
						<form>
						<div
								style="border-radius: 10px; background: #b8daff; height: 250px">
							<div class="form-group pb-1" style="font-size: 1.4em">
									<label for="comment"> <strong>${nickname}</strong>님
										환영합니다!
									</label>
							</div>
							<button type="button"
								class="btn btn-outline-secondary mr-2 mPageGo">마이페이지</button>
							<button type="button"
								class="btn btn-outline-secondary mr-2 withdrawalBtn">회원탈퇴</button>
							<br> <br>
							<button type="button" id="kaLogout">
								<img height="49" width="222" src="Resources/img/klogout.PNG" />
							</button>
							</div>
						</form>
					</c:when>
					<c:when test="${type==3}">
						<form>
						<div
								style="border-radius: 10px; background: #b8daff; height: 150px">
							<div class="form-group pb-1" style="font-size: 1.2em">
									<label for="comment"> <strong>${nickname}</strong>님
										환영합니다!
									</label>
							</div>
							<button type="button"
								class="btn btn-outline-secondary mr-2 mPageGo">마이페이지</button>
							<button type="button"
								class="btn btn-outline-secondary mr-2 withdrawalBtn">회원탈퇴</button>
							<button type="button" class="btn btn-outline-secondary mr-2"
								id="emailLogout">로그아웃</button>
							<br> <br>
							</div>
						</form>
					</c:when>
					<c:when test="${type==4}">
						<form>
						<div
								style="border-radius: 10px; height: 200px; background: #b8daff">
							<div class="form-group pb-3">
								<label for="comment"> 어서오세요 <strong>admin</strong>님!
										환영합니다!
									</label>
							</div>
							<button type="button" class="btn btn-outline-secondary mr-2"
								id="emailLogout">로그아웃</button>
							<br> <br>
							<button type="button" class="btn btn-outline-secondary mr-2"
								id="adminPage">관리자 페이지</button>
							<br>
							</div>
						</form>
					</c:when>
					<c:otherwise>
						<form action="login.me" method="POST">
							<div class="form-group pb-1">
								<label for="exampleInputEmail1">아이디</label> <input type="email"
									name="id" class="form-control" id="exampleInputEmail1"
									aria-describedby="emailHelp" placeholder="아이디를 입력해주세요">
							</div>
							<div class="form-group pb-1">
								<label for="exampleInputPassword1">비밀번호</label> <input
									type="password" name="pw" class="form-control"
									id="exampleInputPassword1" placeholder="비밀번호를 입력해주세요">
							</div>
							<button type="submit" class="btn btn-outline-secondary mr-2">로그인</button>
							<button type="button" class="btn btn-secondary" id="signUp_btn">가입하기</button>
							<button type="button" class="btn btn-secondary" id="getPw">비밀번호
								찾기</button>
							<br> <br> <a id="kakao-login-btn"></a><a
								href="http://developers.kakao.com/logout"></a> <a
								href="login.na"><img height="49" width="222"
								src="Resources/img/naver.PNG" /></a>
						</form>
					</c:otherwise>
				</c:choose>
			</div>
		</div>
		<!--    본문2 -->
		<!--    학습 툴 -->
		<div class="row pt-5">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<h1 class="display-5 font-weight-bold">시작하기</h1>
				<p class="lead font-weight-bold">새로운 디지털 기술을 체험하고 이웃들과 공유하세요!</p>
			</div>
		</div>
		<div class="row mb-4">
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 text-center mt-4">
				<div class="card bg-success myCard" style="width: 18rem;">
					<img
						src="https://scratch.mit.edu/images/ideas/activities/animate-a-name-thumb.jpg"
						class="card-img-top" alt="card_img1">
					<div class="card-body">
						<h5 class="card-title font-weight-bold">클릭 한 번으로 메뉴 이름 이해하기</h5>
						<p class="card-text">모르는 단어를 클릭해보세요. 즉시 한글로 번역해 드립니다.</p>
						<a href="#" class="btn btn-primary">체험하기</a>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 text-center mt-4">
				<div class="card bg-danger myCard" style="width: 18rem;">
					<img
						src="https://scratch.mit.edu/images/ideas/activities/animate-a-name-thumb.jpg"
						class="card-img-top" alt="card_img1">
					<div class="card-body">
						<h5 class="card-title font-weight-bold">키오스크 체험 시작하기</h5>
						<p class="card-text">키오스크 사용법을 체험하고 연습해 보세요. 이제 혼자서도 주문할 수
							있습니다.</p>
						<a href="startGame.kiosk" class="btn btn-primary">체험하기</a>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 text-center mt-4">
				<div class="card bg-warning myCard" style="width: 18rem;">
					<img src="Resources/img/photo3.png" class="card-img-top"
						alt="card_img1">
					<div class="card-body">
						<h5 class="card-title font-weight-bold">내 주변에 있는 매장 검색해보기</h5>
						<p class="card-text">키오스크 사용법이 익숙해졌다면 실제 매장에 가서 주문해보세요!</p>
						<input type="button" class="btn btn-primary" value="체험하기"
							id="storeSerchBtn">
					</div>
				</div>
			</div>
		</div>
		<!--    본문3 -->
		<div class="row pt-5">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<h1 class="display-5 font-weight-bold">소통하기</h1>
				<p class="lead font-weight-bold">모르는 게 있으면 망설이지 말고 물어보세요!</p>
			</div>
		</div>
		<div class="row pb-5">
			<!--    배너 -->
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 mt-4">
				<div class="card text-center text-white bg-light p-2">
					<div class="bd-example">
						<div id="carouselExampleCaptions" class="carousel slide"
							data-ride="carousel">
							<ol class="carousel-indicators my-card">
								<li data-target="#carouselExampleCaptions" data-slide-to="0"
									class="active"></li>
							</ol>
							<div class="carousel-inner pt-3 pb-1">
								<div class="carousel-item active my-card myBanner">
									<img src="Resources/img/support.jpg" class="d-block" alt="1">
								</div>
							</div>
						</div>
					</div>
					<div class="card-body">
						<button type="button" class="btn btn-primary"
							data-toggle="tooltip" data-placement="top" title="Tooltip on top"
							id="supportBtn">후원하기</button>
					</div>
				</div>
			</div>
			<!--    공지사항, 게시판 -->
			<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-5">
				<ul class="nav nav-tabs">
					<li class="nav-item"><a class="nav-link active infoBtn"
						data-toggle="tab" href="#info">공지사항</a></li>
					<li class="nav-item"><a class="nav-link freeBtn"
						data-toggle="tab" href="#freeBoard">자유게시판</a></li>
					<li class="nav-item"><a class="nav-link qnaBtn"
						data-toggle="tab" href="#qna">질문게시판</a></li>
				</ul>
				<div class="tab-content">
					<div class="tab-pane fade show active" id="info">
						<h5 class="font-weight-bold mb-3">새로운 정보를 알려드립니다</h5>
						<div class="row text-center">
							<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 font-weight-bold d-none d-sm-block">번호</div>
							<div class="col-lg-4 col-md-8 col-sm-10 col-xs-10 font-weight-bold myTitle d-none d-sm-block">글제목</div>
							<div class="col-lg-2 col-md-2 col-sm-4 col-xs-4 font-weight-bold d-none d-md-block">작성일</div>
							<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4 font-weight-bold d-none d-lg-block">작성자</div>
							<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4 font-weight-bold d-none d-lg-block">조회수</div>
						</div>
						<div class="row text-center">
							<c:choose>
								<c:when test="${noticeRecordCount == 0 }">
									<div class="noneRecord col-lg-12 col-md-12 col-sm-12 mt-2">등록된 게시물이 없습니다.</div>
								</c:when>
								<c:otherwise>
									<c:forEach var="list" items="${mainNoticeList}">
										<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2  d-none d-sm-block">${list.seq }</div>
										<div class="col-lg-4 col-md-8 col-sm-10 col-xs-10  myTitle d-none d-sm-block">
											<a href="noticeContent.board03?seq=${list.seq }&&commentPage=1">${list.title }</a>
										</div>
										<div class="col-lg-2 col-md-2 col-sm-4 col-xs-4  d-none d-md-block">${list.timeForm }</div>
										<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4  d-none d-lg-block">${list.writer }</div>
										<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4  d-none d-lg-block">${list.viewCount }</div>
									</c:forEach>
								</c:otherwise>
							</c:choose>
						</div>
					</div>
					<div class="tab-pane fade" id="freeBoard">
						<div class="row text-center">
							<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 font-weight-bold d-none d-sm-block">번호</div>
							<div class="col-lg-4 col-md-8 col-sm-10 col-xs-10 font-weight-bold myTitle d-none d-sm-block">글제목</div>
							<div class="col-lg-2 col-md-2 col-sm-4 col-xs-4 font-weight-bold d-none d-md-block">작성일</div>
							<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4 font-weight-bold d-none d-lg-block">작성자</div>
							<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4 font-weight-bold d-none d-lg-block">조회수</div>
						</div>
						<div class="row text-center">
							<c:choose>
								<c:when test="${freeRecordCount == 0 }">
									<div class="noneRecord col-lg-12 col-md-12 col-sm-12 mt-2">등록된 게시물이 없습니다.</div>
								</c:when>
								<c:otherwise>
									<c:forEach var="list" items="${mainFreeList}">
										<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2  d-none d-sm-block">${list.seq }</div>
										<div class="col-lg-4 col-md-8 col-sm-10 col-xs-10  myTitle d-none d-sm-block">
											<a href="freeContent.board01?seq=${list.seq }&&commentPage=1">${list.title }</a>
										</div>
										<div class="col-lg-2 col-md-2 col-sm-4 col-xs-4  d-none d-md-block">${list.timeForm }</div>
										<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4  d-none d-lg-block">${list.writer }</div>
										<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4  d-none d-lg-block">${list.viewCount }</div>
									</c:forEach>
								</c:otherwise>
							</c:choose>
						</div>
					</div>
					<div class="tab-pane fade" id="qna">
						<div class="row text-center">
							<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 font-weight-bold d-none d-sm-block">번호</div>
							<div class="col-lg-4 col-md-8 col-sm-10 col-xs-10 font-weight-bold myTitle d-none d-sm-block">글제목</div>
							<div class="col-lg-2 col-md-2 col-sm-4 col-xs-4 font-weight-bold d-none d-md-block">작성일</div>
							<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4 font-weight-bold d-none d-lg-block">작성자</div>
							<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4 font-weight-bold d-none d-lg-block">조회수</div>
						</div>
						<div class="row text-center">
							<c:choose>
								<c:when test="${qnaRecordCount == 0 }">
									<div class="noneRecord col-lg-12 col-md-12 col-sm-12 mt-2">등록된 게시물이 없습니다.</div>
								</c:when>
								<c:otherwise>
									<c:forEach var="list" items="${mainQnaList}">
										<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 d-none d-sm-block">${list.seq }</div>
										<div class="col-lg-4 col-md-8 col-sm-10 col-xs-10  myTitle d-none d-sm-block">
											<a href="qnaContent.board02?seq=${list.seq }&&commentPage=1">${list.title }</a>
										</div>
										<div class="col-lg-2 col-md-2 col-sm-4 col-xs-4  d-none d-md-block">${list.timeForm }</div>
										<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4  d-none d-lg-block">${list.writer }</div>
										<div class="col-lg-2 col-md-6 col-sm-4 col-xs-4  d-none d-lg-block">${list.viewCount }</div>
									</c:forEach>
								</c:otherwise>
							</c:choose>
						</div>
					</div>
				</div>
				<div class="more">
					<a href="list.board03?noticeCurrentPage=1" class="moreBtn">더 보기 ></a>
				</div>
			</div>
		</div>
	</div>
	<!--    footer -->
	<div class="container-fluid footer pt-5">
		<div class="row pt-2 pb-5">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<h1 class="display-5 font-weight-bold">사이트맵</h1>
				<p class="lead font-weight-bold">ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ</p>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<div class="">
					<span class="logo">Logo</span>
					<dl>
						<dt>Assembly(주)</dt>
						<dd>(04540)서울특별시 중구 남대문로 120 대일빌딩 2층, 3층</dd>
						<dd>대표이사: 홍길동 사업자등록번호 : 815-81-00000</dd>
						<dd>Tel: 1599-0000 Fax: 02-894-0000</dd>
						<dd>E-mail: custimerservice@aaaa.co.kr</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
	<!-- Optional JavaScript -->
	<!-- jQuery first, then Popper.js, then Bootstrap JS -->

	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
	<script
		src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
	<!-- NAVER KAKAO -->
	<script type='text/javascript'>
     Kakao.init('49283e307f214dc8c2edee1cae89f2cb');
     Kakao.Auth.createLoginButton({
          container : '#kakao-login-btn',
       success : function(authObj) {            
       location.href = "login.ka";         
       },         
       fail : function(err) { 
              alert(JSON.stringify(err));
          }
       });
 </script>
</body>
</html>