$(document).ready(function() {

  // Login Modals
  // ---------------------------------------------------

  $('#signin').click(function() {
    $('.modal').addClass('visible');
    showSignInModal();
  });

  $('#join').click(function() {
    $('.modal').addClass('visible');
    showJoinModal();
  });

  $('.close').click(function() {
    $('.modal').removeClass('visible');
  });

  $('a[data-modal-pane="join"]').click(function() {
    showJoinModal();
  });

  $('a[data-modal-pane="signin"]').click(function() {
    showSignInModal();
  });

  $('a[data-modal-pane="password"]').click(function() {
    $('.modal-pane-password').removeClass('hidden');
    $('.modal-pane-signin').addClass('hidden');
    $('.modal-pane-join').addClass('hidden');
  });

  // Dropdowns
  // ---------------------------------------------------

  $('.dropdown').click(function() {
    if (!$(this).hasClass('disabled')) {
      $(this).toggleClass('active');
      $('body').append('<div class="dropdown-overlay"></div>');
      $(this).find('.dropdown__menu').slideToggle();

      $('.dropdown-overlay').click(function() {
        $('.dropdown-overlay').remove();
        $('.dropdown').removeClass('active');
        $('.dropdown__menu').hide();
      })
    }
  });

  $('.dropdown__menu li').click(function() {
    $('.dropdown-overlay').remove();
  });

  $('.state').click(function() {
    var selector = $('.dropdown--cities');
    var state = $(this).attr('data-content');

    if (state === '57b9a7671322c4280dcb4647') {
      selector.find('.dropdown__title').html('¿En qué delegación?<i class="icon-chevron-down"></i>')
    }

    $.ajax({
      type: 'GET',
      url: '/api/v1/cities/?state=' + state,
      dataType: 'json',
      success: function(res) {
        console.log(res);

        $('.dropdown--cities .dropdown__menu ul').empty();

        for (i = 0; i < res.cities.length; i++) {
          var city = res.cities[i];
          console.log(city)

          $('.dropdown--cities .dropdown__menu ul').append('<li data-content="' + city.cityID + '" class="city"><span>' + city.name + '</span></li>');
        }

        selector.removeClass('disabled');
      },
      error: function(err) {
        console.log(err);
      }
    });
  })

});

function showSignInModal() {
  $('.modal-pane-signin').removeClass('hidden');
  $('.modal-pane-join').addClass('hidden');
  $('.modal-pane-password').addClass('hidden');
}

function showJoinModal() {
  $('.modal-pane-join').removeClass('hidden');
  $('.modal-pane-signin').addClass('hidden');
  $('.modal-pane-password').addClass('hidden');
}

function searchCampaigns(type, value) {
  $.ajax({
    type: 'GET',
    url: '/api/v1/campaigns/?' + type + '=' + value,
    dataType: 'json',
    success: function(res) {
      console.log(res);

      $('.dropdown--cities .dropdown__menu ul').empty();

      for (i = 0; i < res.cities.length; i++) {
        var city = res.cities[i];
        console.log(city)

        $('.dropdown--cities .dropdown__menu ul').append('<li data-content="' + city.cityID + '" class="city"><span>' + city.name + '</span></li>');
      }

      selector.removeClass('disabled');
    },
    error: function(err) {
      console.log(err);
    }
  });
}
