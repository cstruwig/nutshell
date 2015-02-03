Template.shell.events({
	'onload': function() {
		alert('running shell');
		
	}
});

Template.shell.rendered = function() {
    if(!this._rendered) {
		this._rendered = true;
		$('#myTab a[role="tab"]').each(function(ctr, item) {
			console.log('activating all tabs' + ctr);
		});	
    }
};