
/* $(document).ready(function() {		
    $('#calendar').fullCalendar({           			header: {				
           left: 'prev,next today',
           center: 'title',
           right: 'month,basicWeek,basicDay',			 
       },
       locale: 'es',
        monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
       monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
       dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
       dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],	
                               
//-----Inicio Evento Click
         dayClick: function(date, jsEvent, view) {
           $("#txtFecha").val(date.format());
             $("#ModalEventos").modal();
       }
        //-----Fin Evento Click		
                               
       });		 // full calendar		
   });  // function */