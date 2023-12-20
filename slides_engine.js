let lastScrollTop = 0; //It is updated in each scroll to check if it is scrolled up or

/**
 * Gets the scroll position of the web page and calls the functions of the slide player
 * @param {*} slide_player  slide player that will be updated with the function
 */
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

/**
 * Slide Player class has methods that updates the slides and animations 
 * by a scroll position
 */
class Slide_Player {
    constructor(){
        this.slide = null; // current slide
        this.deck = []; // deck of slides
    }
    /**
     * Scroll down update
     * @param {*} window_scroll_position 
     */
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
    /**
     * Checks if the slide or animation should be played if it is scroll down
     * @param {*} obj slide or animation
     * @param {*} window_scroll_position 
     * @returns boolean 
     */
    is_scroll_down(obj, window_scroll_position){
        if(obj.scroll_position <= window_scroll_position){
            return true;
        }
        return false;
    }
    /**
     * Scroll up update
     * @param {*} window_scroll_position 
     */
    scroll_up(window_scroll_position){
        let updated = false;
        for(let i=0; i < this.deck.length; i++){
            if(this.is_scroll_up(this.deck[i], window_scroll_position, updated)){
                if(this.slide){this.slide.remove();}
                    if(i>0){
                        this.slide = this.deck[i-1];
                    } else {
                        this.slide = this.deck[0];
                    }
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
                    if(i>0){
                        this.slide.animation.deck[i-1].action();
                    } else {
                        this.slide.animation.deck[0].action();
                    }
                    updated = true;
                }
            }
        }
    }
    /**
     * Checks if the slide or animation should be played if it is scroll up
     * @param {*} obj slide or animation
     * @param {*} window_scroll_position 
     * @param {*} updated 
     * @returns boolean
     */
    is_scroll_up(obj, window_scroll_position, updated){
        if(
            obj.scroll_position >= window_scroll_position &&
            !updated
        ){
            return true;
        }
        return false;
    }
    /**
     * Shows slide in webpage
     */
    play_slide(){
        if(this.slide){
            this.slide.play();
        }

    }
    /**
     * Checks if slide has an assigned animation
     * @returns boolean
     */
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
    /**
     * Adds scroll bar length
     * @param {*} n 
     */
    enlarge_page(n){
        for(let i=0; i<= n; i++){
            document.body.innerHTML += '<br />'
        }
    }
}

/**
 * Slide for scroll
 */
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
        let body_html = 
            '<div id="' + this.div_id + '" >' +
             html +
             '</div>';
        document.body.innerHTML += body_html;
        this.add_svg();
    }

    add_svg(){
        document.getElementById(this.div_id).children[0].setAttribute(
            'id', this.div_id + '_svg'
            );
    }

    update_style(){
        document.getElementById(this.div_id).style.position = 'fixed';
        document.getElementById(this.div_id).style.marginLeft = 'auto';

    }
    play(){
        document.getElementById(this.div_id).style.marginTop = 'auto';
    }
    remove(){
        document.getElementById(this.div_id).style.marginTop = '1000%';
    }
  }

class Animation {
    constructor(slide){
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
    update_animation_frames_scroll(){
        for(let i = 0; i < this.deck.length; i++){
            this.deck[i].scroll_position = this.deck[i].get_scroll_y();
        }
    }
}

class Animation_Frame {
    constructor(action, slide){
        this.action = action;
        this.set_animation(slide);
        this.slide_player = slide.slide_player;
        this.animation.deck.push(this);
        this.animation.update_animation_frames_scroll();
    }
    get_scroll_y(){
        return this.animation.slide.scroll_position + 
            this.animation.length * this.get_animaiton_frame_position() / 
            this.animation.deck.length;
    }
    get_animaiton_frame_position(){
        for(let i=0; i < this.animation.deck.length; i++){
            if(this.animation.deck[i] == this){
                return i;
            }
        }
    }
    set_animation(slide){
        if(slide.animation){
            this.animation = slide.animation;
        } else {
            slide.animation = new Animation(slide);
            this.animation = slide.animation;
        }
    }
}

class Circle_Animation {
    constructor(src, slide, ratio, color){
        this.src = src;
        this.slide = slide;
        this.ratio = ratio;
        this.color = color;
        this.circle_animation();
    }
    circle_animation(){
        for(let i=0; i  < this.src.length; i++){
            let radius = this.src[i][1] / this.ratio;
            let cx = document.getElementById(this.src[i][0]).getAttribute('cx');
            let cy = document.getElementById(this.src[i][0]).getAttribute('cy');
            let tag = this.src[i][0];
            let svg = this.slide.div_id + '_svg';
            new Circle_Animation_Frame(cx, cy, radius, svg, this.color, this.slide, tag)
        }
    }
}

class Circle_Animation_Frame extends Animation_Frame{
    constructor(cx, cy, r, svg, color, slide, tag){
        super(
            function(){
                var elementExists = document.getElementById('_animation_frame_circle_');
                if(elementExists){elementExists.remove()}

                let circle = '<ellipse id="_animation_frame_circle_" ' +
                'cx="' + cx + '" cy="' + cy + '"'+
                ' rx="' + r + '" ry="' + r + '" '+
                'style="fill:' + color + ';"/>';

                let x = 50;
                let y = 270;

                document.getElementById(svg).innerHTML += circle;

                write_legend(tag, svg, r, x, y);
            } , slide
        )
    }
}

class SVG_Scroll_Play{
    constructor(ids, plays, slide){
        this.ids = ids;
        this.group_ids = this.get_group_id();
        this.plays = plays;
        this.plays = plays;
        this.slide = slide;
        this.create_animation_frames();
    }
    create_animation_frames(){
        for(let i=0; i < this.plays.length; i++){
            new SVG_Scroll_Play_Animation_Frame(
                this.group_ids, this.plays[i], this.slide
            )
        }
    }
    get_group_id(){
        let group_ids = [];
        for (let i=0; i < this.ids.length; i++){
            group_ids.push(new Id_Group(this.ids[i]));
        }
        return group_ids;
    }
}

class SVG_Scroll_Play_Animation_Frame extends Animation_Frame{
    constructor(group_ids, play, slide){
        let play_map = Array(group_ids.length).fill(0);
        for(let i = 0; i < play.length; i++){
            play_map[play[i]] = 1
        }
        super(
            function(){
                for(let i = 0; i < group_ids.length; i++){
                    if(play_map[i] == 0){
                        group_ids[i].deactivate();
                    } else {
  
                        group_ids[i].activate();
                    }
                }
            }, slide
        )
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

function write_legend(tag, svg, r, x, y){
    let id = 'legend_ships';

    if(document.getElementById(id)){
        let elem = document.getElementById(id);
        elem.parentNode.removeChild(elem);
    }
    
    if(tag.includes('_ships')){
        tag = tag.substring(0, tag.length - 6);
    }

    let legend = '<text id="'+id+'" class="legend" x="'+x+'" y="'+y+'">' + tag + ' : ' + r + ' ships </text>';

    document.getElementById(svg).innerHTML += legend;
}