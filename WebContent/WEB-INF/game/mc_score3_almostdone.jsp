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
    <link rel="stylesheet" href="Resources/css/leftMenuSliderUp.css">
	<!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
 	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css">
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
		.my{border:1px solid #000;}
 		#popup{background:rgba(0,0,0,0.6); padding:100px 150px; position:fixed; top:10%; left:50%; margin-left:-500px; z-index:999;}
/*  		iframe{box-shadow:0 0 50px 15px #444;}  */
		#close{width:45px; height:45px; background:#ddd; margin:0 auto; padding-top:15px;}
		.lcd{border:30px solid #000; border-bottom:55px solid #000; border-radius:5px;}
		.machine{width:100%; height:550px; background:url(img/mc_machine.png) no-repeat; background-size:cover;}
		.card{padding:10px 0px 0 0px;}
		.cardImg{display:inline-block; margin:0 auto;}
		.menuList{height:700px; overflow-y:auto;}
		.bounce{-webkit-transform-origin: center bottom; transform-origin: center bottom; position:absolute; width:50px; height:50px; border-radius:50%; background:yellow; opacity:0.6;}
	</style>
</head>
<body>
<!-- 스크립트 시작 -->
	<script>
		$(function(){
			$('#btnBefore').on('click', function(){
				window.history.back();
			});
		});
	</script>
<!-- 스크립트 끝 -->
<!-- popup -->
	<div id="popup" class="d-none">
		<iframe width="560" height="315" src="https://www.youtube.com/embed/xzGHzruXHbA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>
		<button id="close" class="d-flex justify-content-center">닫기</button>	
	</div>
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
	<div class="container mainPage">
		<div class="row my text-center">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 my">
				<div class="row my">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
						광고
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my">
						<form id="speakerForm">
							<div id="fake" style="display:none;">각 칸을 눌러 품목을 올바르게 선택했는지 확인 후, [장바구니]를 눌러 [결제하기]까지 진행하세요</div>
						    <input type="text" id="speakerTxt" class="text-center" style="width:100%; border:none; background:none;" disabled>
								<script>
									document.getElementById('speakerTxt').value=document.getElementById('fake').innerText;
								</script>
						    <button id="play" type="submit">Play</button>
						    <div style="display:none;">
						      <label for="rate">Rate</label><input type="range" min="0.5" max="2" value="1" step="0.1" id="rate">
						      <div class="rate-value">1</div>
						      <div class="clearfix"></div>
						    </div>
						    <div style="display:none;">
						      <label for="pitch">Pitch</label><input type="range" min="0" max="2" value="1" step="0.1" id="pitch">
						      <div class="pitch-value">1</div>
						      <div class="clearfix"></div>
						    </div>
						    <select id="speakerSelect" style="display:none;">
						    </select>
						</form>
						<script src="Resources/js/speaker.js"></script>
<!----------machine view start----------------------------------------------->
					<div class="row my">
						<div class="col-lg-10 col-md-12 col-sm-12 col-xs-12 pl-4 pr-4">
							<div class="row lcd" id="mcClick">
				<!-- carousel start-->
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
								<div id="carouselExampleIndicators" class="carousel slide my">
								  <div class="carousel-inner">
								    <div class="carousel-item active">
	    					<!-- 		탭 화면 시작-->
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
											<h1>(4)선택내역 확인하기</h1>
											<div class="accordion" id="accordionExample">
											  <div class="card">
											    <div class="card-header" id="headingOne">
											      <h2 class="mb-0">
											        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
											          1단계 : 선택한 상품(햄버거) 사진과 이름 / 버튼(상품 속성 빼기)
											        </button>
											      </h2>
											    </div>
											    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
											      <div class="card-body">
											          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
														<img id="menuImg" src="${burgerResult.imgAddr}"><i></i>
														<p class="h5" id="menuName">${burgerResult.menuName }</p>
														<p id="menuEng">${burgerResult.menuNameEng }</p>
														<p class="h5" id="price">${burgerResult.price }원</p>
													  </div>
											      </div>
											    </div>
											  </div>
											  <div class="card">
											    <div class="card-header" id="headingTwo">
											      <h2 class="mb-0">
											        <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">  
											          2단계 : 사이드 메뉴 선택하기(감자튀김 등)
											        </button>
											      </h2>
											    </div>
											    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
											      <div class="card-body">
											      	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
														<img id="menuImg" src="${sideResult.imgAddr}"><i></i>
														<p class="h5" id="menuName">${sideResult.menuName }</p>
														<p id="menuEng">${sideResult.menuNameEng }</p>
														<p class="h5" id="price">${sideResult.price }원</p>
													  </div>
											      </div>
											    </div>
											  </div>
											  <div class="card">
											    <div class="card-header" id="headingThree">
											      <h2 class="mb-0">
											        <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
											          3단계 : 음료, 카페, 디저트 옵션
											        </button>
											      </h2>
											    </div>
											    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
											      <div class="card-body">
											      	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
														<img id="menuImg" src="${beverageResult.imgAddr}"><i></i>
														<p class="h5" id="menuName">${beverageResult.menuName }</p>
														<p id="menuEng">${beverageResult.menuNameEng }</p>
														<p class="h5" id="price">${beverageResult.price }원</p>
													  </div>
											      </div>
											    </div>
											  </div>
											</div>
										</div>
							<!-- 		탭 화면 끝 -->
										<button id="btnBefore">이전단계</button>
										<button id="slideBtn2">선택완료</button>
	   							</div>
							    <div class="carousel-item">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
									  (5)아래는 결제될 내역입니다
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
								          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
											<img id="menuImg" src="${burgerResult.imgAddr}"><i></i>
											<p class="h5" id="menuName">${burgerResult.menuName }</p>
											<p id="menuEng">${burgerResult.menuNameEng }</p>
											<p class="h5" id="price">${burgerResult.price }원</p>
										  </div>
									      	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
												<img id="menuImg" src="${sideResult.imgAddr}"><i></i>
												<p class="h5" id="menuName">${sideResult.menuName }</p>
												<p id="menuEng">${sideResult.menuNameEng }</p>
											<p class="h5" id="price">${sideResult.price }원</p>
											  </div>
								      	 <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
											<img id="menuImg" src="${beverageResult.imgAddr}"><i></i>
											<p class="h5" id="menuName">${beverageResult.menuName }</p>
											<p id="menuEng">${beverageResult.menuNameEng }</p>
											<p class="h5" id="price">${beverageResult.price }원</p>
										  </div>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
									    <button id="slideBtn1">이전</button>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my text-center">
									    <button>주문취소</button>
										<button id="payButton">결제하기</button>
									</div>
							    </div>
							  </div>
							</div>
						</div>
<script>
	$('#carouselExampleIndicators').carousel("pause");
	$('#slideBtn2').on('click', function(){
		var index = $('.carousel-inner').find('.active').index();
		$('#slideBtn2').attr({"data-target" : "#carouselExampleIndicators", "data-slide-to" : index+1});
	});
	$('#slideBtn1').on('click', function(){
		var index = $('.carousel-inner').find('.active').index();
		$('#slideBtn1').attr({"data-target" : "#carouselExampleIndicators", "data-slide-to" : index-1});
	});
	$('#payButton').on("click", function(){
		$('#popup').removeAttr("class", "d-none");
	});
	$('#close').on('click', function(){
		$('#popup').attr("class", "d-none");
		$(location).attr("href", "mc_fin.third");
	});
</script>
				<!-- carousel end-->
						</div>
						</div>
						<div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 my card">
							<img class="cardImg" src="Resources/img/card.png" width="230" height="500">
						</div>
					</div>
<!-- -------machine view end----------------------------------------------->
					</div>
				</div>
			</div>
		</div>
	</div>		
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