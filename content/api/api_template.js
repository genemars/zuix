zuix.controller(function (cp) {
    var linkedApi = [
        'ZxQuery',
        'Zuix',
        'ContextOptions',
        'ComponentContext',
        'ContextController',
        'ContextControllerHandler',
        'ContextErrorCallback',
        'ContextReadyCallback',
        'EventCallback',
        'IterationCallback',
        'InstanceIterationCallback',
        'ContextOptions',
        'ElementPosition'];

    cp.create = function () {
        var data = cp.options().data;
        var html;

        // TODO: Constructor...

        // Methods
        if (data.methods != null && data.methods.length > 0) {

            html = '';
            zuix.$.each(data.methods, function (i) {

                html += buildMethodTitle(this);

                html += '<div class="container"><div class="details collapsed">';

                var pl = {content: this.description};
                cp.trigger('html:parse', pl, true);
                html += '<div class="description">' + pl.content + '</div>';

                html += buildMethodParams(this);
                html += buildReturnType(this);
                html += buildExamples(this);

                html += '</div></div>';

            });
            cp.field('methods')
                .html(html)
                .find('div.title')
                .css('cursor', 'pointer')
                .on('click', function () {
                    expandItem(this);
                });
            cp.trigger('view:process', cp.field('methods'), true);

        } else cp.field('container-methods').hide();

        // Properties
        if (data.properties != null && data.properties.length > 0) {

            html = buildTypes(data.properties);
            cp.field('properties')
                .html(html);
            cp.trigger('view:process', cp.field('properties'), true);

        } else cp.field('container-properties').hide();

        // Custom types and callbacks used in this class
        if ((data.types != null && data.types.length > 0) || (data.callbacks != null && data.callbacks.length > 0)) {

            html = '';

            zuix.$.each(data.callbacks, function (i) {

                html += '<div><a id="ZUIX_API--'+this.name+'"></a>';
                html += '<h6>' + this.name + '</h6>';
                html += '<p>' + this.description + '</p>';
                html += '<code class="language-js">function '+buildCallbackArgs(this)+' { ... }</code>';
                html += buildMethodParams(this);
                html += buildReturnType(this);
                html += buildExamples(this);
                html += '</div>';

            });

            zuix.$.each(data.types, function (i) {

                html += '<div><a id="ZUIX_API--'+this.name+'"></a>';
                html += '<h6>' + this.name + '</h6>';
                html += '<p>' + this.description + '</p>';
                html += '<strong><small>PROPERTIES</small></strong>';
                html += '<span class="mdl-color-text--accent mdl-typography--font-bold">{</span><br>';
                html += buildTypes(this.properties);
                html += '<span class="mdl-color-text--accent mdl-typography--font-bold">}</span>';
                html += '</div>';

            });
            cp.field('types')
                .html(html);
            cp.trigger('view:process', cp.field('types'), true);

        } else cp.field('container-types').hide();

    };

    function buildMethodTitle(method) {
        var args = '';
        zuix.$.each(method.parameters, function (i) {
            if (this.optional)
                args += '[' + this.name + ']';
            else
                args += this.name;
            if (i < method.parameters.length-1)
                args += ',';
        });
        return '<div class="title"><h5><i class="material-icons">expand_more</i><code>'+method.name+'('+ args +')</code></h5></div>';
    }

    function buildCallbackArgs(method) {
        var args = '';
        zuix.$.each(method.parameters, function (i) {
            if (this.optional)
                args += '[' + this.name + ']';
            else
                args += this.name;
            if (i < method.parameters.length-1)
                args += ',';
        });
        return '('+ args +')';
    }

    function buildMethodParams(method) {
        var parameterList = '';
        if (method.parameters.length > 0) {
            parameterList = '<p><strong><small>PARAMETERS</small></strong></p> ';
            parameterList += buildTypes(method.parameters);
        }
        return parameterList;
    }

    function buildReturnType(method) {
        var returnType = '';
        if (method.return.length > 0) {
            returnType = '<p><strong><small>RETURN</small></strong></p> ';
            returnType += buildTypes(method.return);
        }
        return returnType;
    }

    function buildTypes(types) {
        var typesList = '<div class="api-member-details">';
        zuix.$.each(types, function (i) {
            if (this.optional)
                typesList += ' <strong class="mdl-color-text--grey-500">optional</strong>';
            var typesHtml = '', types = this.types;
            zuix.$.each(types, function (i) {
                if (linkedApi.indexOf(this.toString()) >= 0)
                    typesHtml += '<a href="#api#ZUIX_API--' + this + '">' + this.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</a>';
                else
                    typesHtml += this.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
                if (i < types.length - 1)
                    typesHtml += ' | ';
            });
            typesList += ' <em class="mdl-color-text--grey-700">{' + typesHtml + '}</em>';
            var pl = { content: this.description };
            if (this.name != null)
                pl.content = '<code>'+ this.name.replace('[','').replace(']','') +'</code>: '+pl.content;
            cp.trigger('html:parse', pl, true);
            if (pl.content.indexOf('<p>') === -1)
                pl.content = '<p>'+pl.content+'</p>';
            typesList += pl.content;
        });
        typesList += '</div>';
        return typesList;
    }

    function buildExamples(method) {
        var examples = '';
        if (method.example.length > 0) {
            var pl = { content: method.example };
            cp.trigger('html:parse', pl, true);
            examples += '<div class="example">'+pl.content+'</div>';
        }
        return examples;
    }

    function expandItem(element) {
        var detail = element.next().children().eq(0);
        var collapsed = detail.hasClass('collapsed');
        if (collapsed) {
            detail.animateCss('fadeInDown', { duration: '0.2s'}).removeClass('collapsed');
            element.find('i').html('expand_less')
                .animateCss('bounce', { duration: '.1s' });
        } else {
            detail.animateCss('fadeOutUp', { duration: '0.2s'}, function () {
                detail.addClass('collapsed');
            });
            element.find('i').html('expand_more')
                .animateCss('bounce', { duration: '.1s' });
        }
        // alternate expand/collapse
        /*cp.view().find('.details').each(function(i, item) {
            if (item !== detail.get())
                this.addClass('collapsed');
        });*/
    }

});