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
        slide_player.play_slide(st);
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
            if(
                this.is_scroll_down(this.deck[i], window_scroll_position)
              ){
                if(this.slide){this.slide.remove();}
                this.slide = this.deck[i];
            }
        }
        if(this.is_there_animation()){
            for(let i=0; i < this.slide.animation.deck.length; i++){
                if(
                    this.is_scroll_down(
                        this.slide.animation.deck[i],
                        window_scroll_position
                    )
                ){
                    this.slide.animation.deck[i].action();
                }
            }
        }
    }
    is_scroll_down(point, window_scroll_position){
        if(point.scroll_position <= window_scroll_position){
            return true;
        }
        return false;
    }
    scroll_up(window_scroll_position){
        let updated = false;
        for(let i=0; i < this.deck.length; i++){
            if(this.is_scroll_up(this.deck[i], window_scroll_position, updated)){
                if(this.slide){this.slide.remove();}
                this.slide = this.deck[i];
                updated = true;
            }
        }
        updated = false;
        if(this.is_there_animation()){
            for(let i=0; i < this.slide.animation.deck.length; i++){
                if(
                    this.is_scroll_up(
                        this.slide.animation.deck[i],
                        window_scroll_position,
                        updated
                    )
                ){
                    this.slide.animation.deck[i].action();
                    updated = true;
                }
            }
        }
    }
    is_scroll_up(point, window_scroll_position, updated){
        if(
            point.scroll_position >= window_scroll_position &&
            !updated
        ){
            return true;
        }
        return false;
    }
    play_slide(st){
        if(this.slide){
            this.slide.play();
        }

    }
    is_there_animation(){
        if(this.slide){
            if(this.slide.animation){
                if(this.slide.animation.deck.length > 0){
                    return true;
                }
            }
        }
        return false;
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
      this.add_html(html)
      this.update_style();
      this.remove();
      slide_player.deck.push(this);
      this.animation = null;
    }
    add_html(html){
        console.log('hola');
        let body_html = 
            '<div id="' + this.div_id + '" >' +
             html +
             '</div>';
        console.log(body_html);
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
        this.length = this.get_length();
        slide.animation = this;
        this.deck = [];
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

class Animation_Frame {
    constructor(action, animation){
        this.action = action;
        this.animation = animation;
        this.slide_player = animation.slide.slide_player;
        animation.deck.push(this);
        this.scroll_position = this.get_scroll_y();
    }
    get_scroll_y(){
        return this.animation.slide.scroll_position + 
            this.animation.length * this.get_animaiton_frame_position() / 
            this.animation.steps;
    }
    get_animaiton_frame_position(){
        return this.animation.deck.length - 1;
    }
}

class Id_Group{
    constructor(ids){
        this.ids = ids;
    }
    activate(){
        for(let i = 0; i < this.ids.length; i++){
            document.getElementById(this.ids[i]).style.visibility = 'visible';
        }
    }
    deactivate(){
        for(let i = 0; i < this.ids.length; i++){
            document.getElementById(this.ids[i]).style.visibility = 'hidden';
        }
    }
}