<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
	<!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<!--     scroll -->
	<link rel="stylesheet" href="Resources/css/jquery.mCustomScrollbar.css"/>
	<link rel="stylesheet" href="Resources/css/mCSB_buttons.png"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="Resources/js/jquery.mCustomScrollbar.js"></script>
<title>Insert title here</title>
	<style>
		*{margin:0 auto;}
		.fixedMenu{position:fixed; background:#fff; z-index:999;}
		.fixedMenuNav{background:#007bff;}
		.fixedMenu .nav-link{color:#fff; font-weight:bold;}
		.jumbotron{padding-top:180px; background:#b8daff;}
		.mainPage{padding-top:200px; background:#F2F2F2;} /*수정*/
		.myCard{border:none;}
		.nav-tabs .nav-link{color:#000; font-weight:bold;}
		.tab-pane{padding:30px; background:#fff; border-radius:0 0 5px 5px; border-left:1px solid #ddd; border-right:1px solid #ddd; border-bottom:1px solid #ddd;}
		.myTitle{text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
		.tabStuff{font-size:13px; color:#555;}
		.myBanner img{paddingtop:10px; width:90%; height:250px; border-radius:50%;}
		.footer{background:#b8daff;}
/* 		(위쪽)수정하지 마세요 */
		#machine{border-radius:5px; border:30px solid #000; border-bottom:55px solid #000;}
		.my{border:1px solid #000;}
		.scrollBar{padding:20px; overflow: auto;}
		.scrollBar>img{cursor:pointer;}
		.card{padding:15px 0px 0px 0px;}
		.cardImg{display:inline-block; margin:0 auto;}
		.choice1{cursor:pointer;}
	</style>
</head>
<body>
<!-- 스크립트 시작 -->
	<script>
		$(function(){
			$('#btnBefore').on('click', function(){
				$(location).attr('href', 'mc_score3_start.jsp');
			}); //뒤로가면 이전 단계로 새로고침
		});
	</script>
<!-- 스크립트 끝 -->
<!-- 고정메뉴 -->
	<div class="container-fluid fixedMenu">
		<div class="row fixedMenuNav p-2">
			<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
			<div class="col-lg-6 col-md-6col-sm-12 col-xs-12">
				<ul class="nav justify-content-center">
				  <li class="nav-item">
				    <a class="nav-link active" href="#">메인페이지</a>
				  </li>
				  <li class="nav-item">
				    <a class="nav-link" href="#">메뉴1</a>
				  </li>
				  <li class="nav-item">
				    <a class="nav-link" href="#">메뉴2</a>
				  </li>
				  <li class="nav-item">
				    <a class="nav-link" href="#">메뉴3</a>
				  </li>
				</ul>
			</div>
			<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
		</div>	
		<div class="row p-1">
			<div class="col-lg-4 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
			<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
				<div class="input-group mt-3 mb-3">
				  <input type="search" class="form-control" placeholder="검색어를 입력하세요" aria-label="Search">
				  <div class="input-group-append">
				    <button class="btn btn-outline-secondary" type="button" id="button-addon2">찾아보기</button>
				  </div>
				</div>
			</div>
			<div class="col-lg-4 col-md-3 col-sm-12 col-xs-12 d-none d-md-block"></div>
		</div>	
	</div>

<!-- 	본문 -->
	<div class="container mainPage text-center">
		<div class="row my">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
				<div class="row my">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
						광고
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
						추천메뉴 <button>이전</button>
					</div>
					<div class="col-lg-10 col-md-12 col-sm-12 col-xs-12 my">
<!----------machine view start----------------------------------------------->
						<div id="machine" class="row my">
<!-- -------machine view content start--------------------------------------->
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my scrollBar">
								<img src="Resources/img/menu1.png" width="300" height="200" data-target="#carouselExampleIndicators" data-slide-to="0">
								<img src="Resources/img/menu2.png" width="300" height="200" data-target="#carouselExampleIndicators" data-slide-to="1">
								<img src="Resources/img/menu3.png" width="300" height="200" data-target="#carouselExampleIndicators" data-slide-to="2">
								<img src="Resources/img/menu4.png" width="300" height="200" data-target="#carouselExampleIndicators" data-slide-to="3">
								<img src="Resources/img/menu5.png" width="300" height="200" data-target="#carouselExampleIndicators" data-slide-to="4">
							</div>
<!-- 캐러셀 시작-->
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
	<div id="carouselExampleIndicators" class="carousel slide my">
	  <div class="carousel-inner">
	    <div class="carousel-item active">
<!-- 			1단계 : 메인메뉴 고르기 끝-->
			<div class="row">	
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					메인메뉴 주문화면
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					<div class="row burgerView">
						<c:forEach var="burger" items="${burgers }">
							<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 my text-center choice1">
								<img id="menuImg" src="${burger.imgAddr}"><i></i>
								<p class="h5" id="menuName">${burger.menuName }</p>
								<p id="menuEng">${burger.menuNameEng }</p>
								<p class="h5" id="price">${burger.price }원</p>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>	
<!-- 			1단계 : 메인메뉴 고르기 끝-->
	    </div>
	    <div class="carousel-item">
<!-- 			2단계 : 사이드메뉴 고르기 시작-->
			<div class="row">	
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					사이드메뉴 주문화면
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					<div class="row sideView">
						<c:forEach var="burger" items="${burgers }">
							<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 my text-center choice1">
								<img id="menuImg" src="${burger.imgAddr}"><i></i>
								<p class="h5" id="menuName">${burger.menuName }</p>
								<p id="menuEng">${burger.menuNameEng }</p>
								<p class="h5" id="price">${burger.price }원</p>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>
<!-- 			2단계 : 사이드메뉴 고르기 끝-->
	    </div>
	    <div class="carousel-item">
<!-- 			3단계 : 음료 고르기 시작-->
			<div class="row">	
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					사이드메뉴 주문화면
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					<div class="row beverageView">
						<c:forEach var="burger" items="${burgers }">
							<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 my text-center choice1">
								<img id="menuImg" src="${burger.imgAddr}"><i></i>
								<p class="h5" id="menuName">${burger.menuName }</p>
								<p id="menuEng">${burger.menuNameEng }</p>
								<p class="h5" id="price">${burger.price }원</p>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>
<!-- 			3단계 : 음료 고르기 끝-->
	    </div>
	    <div class="carousel-item">
<!-- 			4단계 : 음료 고르기 시작-->
			<div class="row">	
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					사이드메뉴 주문화면
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					<div class="row cafeView">
						<c:forEach var="burger" items="${burgers }">
							<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 my text-center choice1">
								<img id="menuImg" src="${burger.imgAddr}"><i></i>
								<p class="h5" id="menuName">${burger.menuName }</p>
								<p id="menuEng">${burger.menuNameEng }</p>
								<p class="h5" id="price">${burger.price }원</p>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>
<!-- 			4단계 : 음료 고르기 끝-->
	    </div>
	    <div class="carousel-item">
<!-- 			5단계 : 음료 고르기 시작-->
			<div class="row">	
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					사이드메뉴 주문화면
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
					<div class="row desertView">
						<c:forEach var="burger" items="${burgers }">
							<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 my text-center choice1">
								<img id="menuImg" src="${burger.imgAddr}"><i></i>
								<p class="h5" id="menuName">${burger.menuName }</p>
								<p id="menuEng">${burger.menuNameEng }</p>
								<p class="h5" id="price">${burger.price }원</p>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>
<!-- 			5단계 : 음료 고르기 끝-->
	    </div>
	  </div>
	</div>
</div>
<!-- 캐러셀 끝 -->
	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
		<button>주문취소</button>
		<button id="btnShopBox">장바구니</button>
	</div>
			<script>
				//scroll
				$(".scrollBar").mCustomScrollbar({
					axis:"x",
					theme:"3d-thick",
					autoExpandScrollbar:true,
					advanced:{autoExpandHorizontalScroll:true},
					setWidth: "100%",
					setHeight: 270,
					scrollButtons:{ enable: true }
				});
				//carousel-navi
				$('.scrollBar img').click("click", function(){
					$('.scrollBar img').css("opacity", "0.6");
					$(this).css("opacity", "1.0");
				});
				//carousel
// 				$('#carouselExampleIndicators').carousel("pause");
				//carousel-contents
				$('.burgerView .choice1').on('click', function(){
					$('.burgerView .choice1').css("background", "none");
					$(this).css("background", "darkgreen");
					console.log($(this).find('#menuName').html());
						$.ajax({
							url : "burger_value.third",
							type : "post",
							data : {key2 : $(this).find('#menuName').html()}
						});
				});
				$('.sideView .choice1').on('click', function(){
					$('.sideView .choice1').css("background", "none");
					$(this).css("background", "darkgreen");
						$.ajax({
							url : "snack_value.third",
							type : "post",
							data : {key2 : $(this).find('#menuName').html()}
						});
				});
				$('.beverageView .choice1').on('click', function(){
					$('.beverageView .choice1').css("background", "none");
					$(this).css("background", "darkgreen");
						$.ajax({
							url : "beverage_value.third",
							type : "post",
							data : {key2 : $(this).find('#menuName').html()}
						});
				});
				$('.cafeView .choice1').on('click', function(){
					$('.cafeView .choice1').css("background", "none");
					$(this).css("background", "darkgreen");
						$.ajax({
							url : "cafe_value.third",
							type : "post",
							data : {key2 : $(this).find('#menuName').html()}
						});
				});
				$('.desertView .choice1').on('click', function(){
					$('.desertView .choice1').css("background", "none");
					$(this).css("background", "darkgreen");
						$.ajax({
							url : "desert_value.third",
							type : "post",
							data : {key2 : $(this).find('#menuName').html()}
						});
				});
				$('#btnShopBox').on("click", function(){
					$(location).attr("href", "mc_slide.third");
				});
			</script>
<!----------machine view end----------------------------------------------->
						</div>	
<!-- -------machine view end----------------------------------------------->
			</div>
			<div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 my card">
				<img class="cardImg" src="Resources/img/card.png" width="230" height="500">
			</div>
		</div>
	</div>
</div>
<script>
	
</script>
		
<!-- 	footer -->
	<div class="container-fluid footer pt-5">
		<div class="row pt-2 pb-5">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<h1 class="display-5 font-weight-bold">사이트맵</h1>
				<p class="lead font-weight-bold">ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ</p>
			</div>				
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				홈페이지 이용약관 등
			</div>
		</div>
	</div>	
</body>
</html>