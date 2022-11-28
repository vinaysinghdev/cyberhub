// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable({
    pageLength: 5,
    lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
    ordering: false
  });

  $('#largedataTable').DataTable({
    ordering: false,
    paging: false,
    "bInfo": false,
    "bFilter": true,
  });

});


