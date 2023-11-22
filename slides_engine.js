var lastScrollTop = 0;

function update_slide_player(slide_player){
    window.addEventListener('scroll', function(event) {
        var st = window.pageYOffset || document.documentElement.scrollTop; 
        console.log(st);
        if (st > lastScrollTop) {
            slide_player.scroll_down(st);
         } else if (st < lastScrollTop) {
            slide_player.scroll_up(st);

         }
        slide_player.play_slide();
        lastScrollTop = st <= 0 ? 0 : st; 
    }, false);
}

class Slide_Player {
    constructor(){
        this.slide = null;
        this.deck = [];
    }
    scroll_down(window_scroll_position){
        for(let i=0; i < this.deck.length; i++){
            if(this.deck[i].scroll_position <= window_scroll_position){
                if(this.slide){this.slide.remove();}
                this.slide = this.deck[i];
            }
        }
    }
    scroll_up(window_scroll_position){
        let updated = false;
        for(let i=0; i < this.deck.length; i++){
            if(
                this.deck[i].scroll_position >= window_scroll_position &&
                !updated
                ){
                if(this.slide){this.slide.remove();}
                this.slide = this.deck[i];
                updated = true;
            }
        }
    }
    play_slide(){
        if(this.slide){this.slide.play();}
    }
    enlarge_page(n){
        for(let i=0; i<= n; i++){
            document.body.innerHTML += '<br />'
        }
    }
}

class Slide {
    constructor(html, div_id, scroll_position, slide_player) {
      this.div_id = div_id;
      this.scroll_position = scroll_position;
      this.slide_player = slide_player;
      add_html(html)
      this.update_style();
      this.remove();
      slide_player.deck.push(this);
    }
    add_html(html){
        let body_html = 
            '<div id="' + this.div_id + '" >' +
             html +
             '</div>';
        document.body.innerHTML += body_html;

    }
    update_style(){
        document.getElementById(this.div_id).style.position = 'fixed';
        document.getElementById(this.div_id).style.marginLeft = 'auto';

    }
    play(){
        document.getElementById(this.div_id).style.marginTop = 'auto';
    }
    remove(){
        document.getElementById(this.div_id).style.marginTop = '100%';
    }
  }

class Animation {
    constructor(steps, slide){
        this.steps = steps;
        this.slide = slide;
        this.length = this.get_length()
    }
    get_length(){
        let slide_player = this.slide.slide_player;
        let deck = slide_player.deck;
        let length = 0;
        for(let i=0; i < deck.length; i++){
            if(deck[i] == this.slide){
                length = deck[i+1].scroll_position - deck[i].scroll_position
            }
        }
        return length;
    }
}