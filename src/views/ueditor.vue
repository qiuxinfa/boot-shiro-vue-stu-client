<template>
  <div>
    <script :id=id type="text/plain"></script>
  </div>
</template>
<script>
  import '../../static/ueditor/ueditor.config.js'
  import '../../static/ueditor/ueditor.all.min.js'
  import '../../static/ueditor/ueditor.parse.min.js'
  export default {
    name: 'ueditor',
    data () {
      return {
        editor: null,
        _content: "",
        loadComplete: false
      }
    },
    props: {
      id: {
        type: String,
        default: `editor_${new Date().getTime()}`
      },
      value: {
        type: String,
        default: ''
      },
      autoLoad: {
        type: Boolean,
        default: true
      },
      config: {
        type: Object,
        default: () => {
          return {
            initialFrameWidth: '100%',
            initialFrameHeight: 350,
            maximumWords:1000,
            toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|','simpleupload', 'insertimage',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'preview', 'searchreplace', 'drafts', 'help'
            ]]
          }
        }
      }
    },
    watch: {
      value: function(newVal, oldVal) {
        if (this.editor) {
          if (!!newVal && newVal !== this._content) {
            this._content = newVal
            this.setContent(this._content)
          } else if(!newVal) {
            this.setContent('')
          }
        }
      },
    },
    mounted() {
     this.$nextTick(() => {
      if(this.autoLoad) {
        this.init()
      }
    })
   },
   methods: {
    init() {
      UE.delEditor(this.id)
      this.editor = UE.getEditor(this.id, this.config)
      this.editor.addListener("ready", () => {
        this.loadComplete = true
        this.editor.setContent(this.value || '')
      })
      this.editor.addListener( 'contentChange', editor => {
        this._content = this.editor.getContent()
        this.$emit('input', this._content)
      })
    },
    get() {
      return this.editor
    },
    getContent() {
      return this.editor.getContent()
    },
    setContent(value) {
      if(this.loadComplete) {
        this.editor.setContent(value)
      }
    }
  },
  destroyed() {
    if(this.editor) {
      this.editor.destroy()
    }
  }
}

</script>
