// declare var draw2d;

ConfirmKeyboardPolicy = draw2d.policy.canvas.DefaultKeyboardPolicy.extend({

  NAME: 'ConfirmKeyboardPolicy',

  /**
     * @constructor
     */
  init() {
    this._super();
  },

  /**
     * @inheritdoc
     * */
  onKeyDown(canvas, keyCode, shiftKey, ctrlKey) {
    //
    if ((keyCode === 8 || keyCode === 46) && canvas.getPrimarySelection() !== null) {
      const count = canvas.getSelection().getSize();
      if (count > 0){
        canvas.remove(canvas.getPrimarySelection());
      }

      /*if (count > 0 && window.confirm('Do you want to delete the selected shape?')) {
        const deletedNode = canvas.getPrimarySelection().userData;
        canvas.remove(canvas.getPrimarySelection());

        this._super(canvas, keyCode, shiftKey, ctrlKey);
        const customEvent = new CustomEvent('nodeDeleted', { detail: deletedNode });
        window.dispatchEvent(customEvent);
      }*/
    } else {
      this._super(canvas, keyCode, shiftKey, ctrlKey);
    }
  }


});


